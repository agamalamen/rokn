import Image from "next/image";
import { ProductImageLightboxHost } from "@/components/product-image-lightbox-host";
import { shopifyImageUrl } from "@/lib/shopify/image";
import type { Image as ShopifyImage } from "@/lib/shopify/types";

const HERO_WIDTH = 640;
const HERO_HEIGHT = 800;

type ProductImageCarouselProps = {
  images: ShopifyImage[];
  title: string;
};

type CarouselSlideProps = {
  image: ShopifyImage;
  title: string;
  index: number;
  priority?: boolean;
  className?: string;
};

function CarouselSlide({
  image,
  title,
  index,
  priority = false,
  className,
}: CarouselSlideProps) {
  return (
    <button
      type="button"
      data-image-index={index}
      className={`overflow-hidden bg-surface ${className ?? ""}`}
      aria-label={`View ${title} image ${index + 1} full size`}
    >
      <Image
        src={shopifyImageUrl(image.url, HERO_WIDTH)}
        alt={image.altText ?? `${title} image ${index + 1}`}
        width={HERO_WIDTH}
        height={HERO_HEIGHT}
        priority={priority}
        sizes="320px"
        className={`h-full w-full cursor-zoom-in object-cover ${
          priority
            ? ""
            : "motion-safe:transform-gpu motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.02]"
        }`}
      />
    </button>
  );
}

export function ProductImageCarousel({
  images,
  title,
}: ProductImageCarouselProps) {
  if (images.length === 0) {
    return (
      <div className="mt-4 flex justify-center px-4">
        <div className="flex aspect-[4/5] w-[82vw] max-w-[320px] items-center justify-center rounded-2xl bg-surface">
          <span className="text-sm text-muted">No image available</span>
        </div>
      </div>
    );
  }

  return (
    <ProductImageLightboxHost images={images} title={title}>
      {images.length === 1 ? (
        <div className="mt-4 flex justify-center px-4">
          <CarouselSlide
            image={images[0]}
            title={title}
            index={0}
            priority
            className="aspect-[4/5] w-[82vw] max-w-[320px] rounded-2xl"
          />
        </div>
      ) : (
        <div className="mt-4">
          <div className="shelf-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 pl-4 pr-4">
            {images.map((image, index) => (
              <CarouselSlide
                key={`${image.url}-${index}`}
                image={image}
                title={title}
                index={index}
                priority={index === 0}
                className="aspect-[4/5] w-[82vw] max-w-[320px] shrink-0 snap-center rounded-2xl"
              />
            ))}
          </div>
        </div>
      )}
    </ProductImageLightboxHost>
  );
}
