import {useEffect, useState} from 'react';
import {Image} from '@shopify/hydrogen';

/**
 * Main image + thumbnail rail, mirroring the reference product page's
 * multi-image gallery (product shots, benefit call-outs, ingredients, etc).
 * @param {{
 *   images: Array<{id: string; url: string; altText: string | null; width: number | null; height: number | null}>;
 *   selectedVariantImage?: {id: string} | null;
 *   title: string;
 * }}
 */
export function ProductGallery({images, selectedVariantImage, title}) {
  const [activeId, setActiveId] = useState(
    selectedVariantImage?.id || images?.[0]?.id,
  );

  // Keep the gallery in sync when a different variant (with its own image)
  // gets selected via the option buttons below.
  useEffect(() => {
    if (selectedVariantImage?.id) {
      setActiveId(selectedVariantImage.id);
    }
  }, [selectedVariantImage?.id]);

  if (!images || images.length === 0) {
    return <div className="product-gallery" />;
  }

  const activeImage = images.find((img) => img.id === activeId) || images[0];

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <Image
          alt={activeImage.altText || title}
          aspectRatio="1/1"
          data={activeImage}
          key={activeImage.id}
          sizes="(min-width: 45em) 50vw, 100vw"
        />
      </div>
      {images.length > 1 ? (
        <div className="product-gallery-thumbs" role="tablist" aria-label="Imágenes del producto">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-selected={image.id === activeImage.id}
              aria-label={`Ver imagen ${index + 1}`}
              className={`product-gallery-thumb${image.id === activeImage.id ? ' is-active' : ''}`}
              onClick={() => setActiveId(image.id)}
            >
              <Image
                alt={image.altText || title}
                aspectRatio="1/1"
                data={image}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
