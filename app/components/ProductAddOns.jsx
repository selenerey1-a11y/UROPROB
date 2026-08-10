import {useState} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

// Generic, non-medical blurb shown for every add-on card. Swap for
// product-specific copy once it's written.
const ADDON_BULLETS = [
  'Pensado para complementar tu rutina diaria',
  'Fácil de combinar con URO Probiótico Vaginal',
  'Mismo estándar de calidad UROPROB',
];

/**
 * "También te puede interesar" — complementary products with an
 * expandable info panel, mirroring the reference page's add-on section.
 * @param {{products: Array<AddOnProductFragment>}}
 */
export function ProductAddOns({products}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="addons-section" aria-labelledby="addons-heading">
      <h2 id="addons-heading" className="addons-title">
        Completa tu rutina
      </h2>
      <div className="addons-grid">
        {products.map((product) => (
          <AddOnCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function AddOnCard({product}) {
  const [open, setOpen] = useState(false);
  const url = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <div className="addon-card">
      <Link to={url} className="addon-card-media" prefetch="intent">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            sizes="(min-width: 45em) 25vw, 45vw"
          />
        ) : null}
      </Link>
      <div className="addon-card-body">
        <Link to={url} className="addon-card-title" prefetch="intent">
          {product.title}
        </Link>
        <span className="addon-card-price">
          <Money data={product.priceRange.minVariantPrice} />
        </span>
        <button
          type="button"
          className="addon-card-toggle"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Ocultar información' : 'Más información'}
        </button>
        {open ? (
          <ul className="addon-card-bullets">
            {ADDON_BULLETS.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}
        <Link to={url} className="addon-card-cta" prefetch="intent">
          Ver producto
        </Link>
      </div>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} AddOnProductFragment */
