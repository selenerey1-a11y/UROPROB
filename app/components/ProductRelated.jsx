import {ProductItem} from '~/components/ProductItem';

/**
 * "Explora nuestros productos" — related products grid.
 * @param {{products: Array<import('storefrontapi.generated').RecommendedProductFragment>}}
 */
export function ProductRelated({products}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="related-section" aria-labelledby="related-heading">
      <h2 id="related-heading" className="related-title">
        Explora nuestros productos
      </h2>
      <div className="related-grid">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
