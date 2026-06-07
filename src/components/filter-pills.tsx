"use client";

type FilterPill = {
  id: string;
  label: string;
};

type FilterPillsProps = {
  filters: FilterPill[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
};

export function FilterPills({
  filters,
  activeFilter,
  onFilterChange,
}: FilterPillsProps) {
  if (filters.length <= 1) {
    return null;
  }

  return (
    <div className="shelf-scroll mb-6 flex gap-2 overflow-x-auto px-4 sm:px-6 lg:px-8">
      {filters.map((filter) => {
        const active = filter.id === activeFilter;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterChange(filter.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-foreground text-white"
                : "bg-surface text-foreground hover:bg-border"
            }`}
            aria-pressed={active}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
