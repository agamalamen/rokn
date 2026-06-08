"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type SelectFilterOption = {
  id: string;
  label: string;
};

type SelectFilterPillProps = {
  label: string;
  options: SelectFilterOption[];
  selectedId: string;
  defaultId: string;
  onChange: (id: string) => void;
  menuLabel: string;
};

type MenuPosition = {
  top: number;
  left: number;
  minWidth: number;
};

export function SelectFilterPill({
  label,
  options,
  selectedId,
  defaultId,
  onChange,
  menuLabel,
}: SelectFilterPillProps) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((option) => option.id === selectedId);
  const isActive = selectedId !== defaultId;
  const buttonLabel = isActive && selected ? selected.label : label;

  function updateMenuPosition() {
    const button = buttonRef.current;
    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
      minWidth: Math.max(rect.width, 176),
    });
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    updateMenuPosition();

    function handleScroll() {
      updateMenuPosition();
    }

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", updateMenuPosition);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        rootRef.current?.contains(target) ||
        (target instanceof Element &&
          target.closest(`[data-select-filter-menu="${menuId}"]`))
      ) {
        return;
      }

      setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [menuId, open]);

  if (options.length <= 1) {
    return null;
  }

  const menu =
    open &&
    menuPosition &&
    createPortal(
      <div
        data-select-filter-menu={menuId}
        role="listbox"
        aria-label={menuLabel}
        style={{
          position: "fixed",
          top: menuPosition.top,
          left: menuPosition.left,
          minWidth: menuPosition.minWidth,
          zIndex: 100,
        }}
        className="max-h-64 overflow-y-auto overflow-x-hidden rounded-2xl border border-border bg-white py-1 shadow-lg"
      >
        {options.map((option) => {
          const active = option.id === selectedId;

          return (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
              className={`flex w-full px-4 py-2.5 text-left text-sm transition-colors ${
                active
                  ? "bg-surface font-medium text-foreground"
                  : "text-foreground hover:bg-surface"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>,
      document.body,
    );

  return (
    <>
      <div ref={rootRef} className="relative shrink-0">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => {
            setOpen((current) => {
              const next = !current;
              if (next) {
                updateMenuPosition();
              }
              return next;
            });
          }}
          className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            isActive
              ? "bg-foreground text-white"
              : "bg-surface text-foreground hover:bg-border"
          }`}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {buttonLabel}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      </div>
      {menu}
    </>
  );
}
