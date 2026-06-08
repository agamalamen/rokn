"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import type { Image as ShopifyImage } from "@/lib/shopify/types";

const ImageLightbox = dynamic(
  () =>
    import("@/components/product-image-lightbox").then((mod) => mod.ImageLightbox),
  { ssr: false },
);

type ProductImageLightboxHostProps = {
  images: ShopifyImage[];
  title: string;
  children: React.ReactNode;
};

export function ProductImageLightboxHost({
  images,
  title,
  children,
}: ProductImageLightboxHostProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest("[data-image-index]");
    if (!target) {
      return;
    }

    setLightboxIndex(Number((target as HTMLElement).dataset.imageIndex));
  }, []);

  return (
    <>
      <div onClick={handleClick}>{children}</div>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          title={title}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
