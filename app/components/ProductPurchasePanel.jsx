import {useMemo, useState} from 'react';
import {Money} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {ProductOptionsSelector} from './ProductOptionsSelector';
import {planDeliveryLabel} from '~/lib/sellingPlan';
import {REVIEWS, getReviewStats} from '~/lib/placeholderReviews';

const reviewStats = getReviewStats(REVIEWS);

// Flat bundle pricing per quantity tier — the *total* the customer pays
// for that many bottles, not a per-unit price. These numbers only hold at
// checkout once matching automatic discounts exist in Shopify to bring
// the real cart total down to them (see chat for the exact setup).
const QUANTITY_TILES = [
  {units: 1, price: '29.99', ribbon: null},
  {units: 2, price: '39.99', ribbon: 'RECOMENDADO'},
  {units: 3, price: '49.99', ribbon: 'MEJOR VALOR'},
];

function unitsLabel(units) {
  return units === 1 ? '1 Bote' : `${units} Botes`;
}

/**
 * The full buy-box: rating link, title, formulated-with line, sold badge,
 * variant options, flat-price quantity tiers, a subscribe-and-save vs
 * one-time purchase choice (available for every quantity tier), an
 * installments hint, and the add-to-cart action with the live total.
 *
 * Subscription pricing/percentages come straight from the product's real
 * sellingPlanGroups/sellingPlanAllocations — nothing is fabricated there;
 * the same monthly plan applies no matter how many bottles are selected.
 * The 2/3-bottle tier prices are cosmetic on the frontend: they only match
 * the real cart total once matching automatic discounts exist in Shopify
 * (see chat for the exact setup).
 * @param {{
 *   product: ProductFragment;
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductPurchasePanel({product, productOptions, selectedVariant}) {
  const {open} = useAside();
  const [tileIndex, setTileIndex] = useState(1);

  const tile = QUANTITY_TILES[tileIndex];
  const cartQuantity = tile.units;
  const currencyCode = selectedVariant?.price?.currencyCode || 'EUR';

  const plans = useMemo(
    () => (product.sellingPlanGroups?.nodes ?? []).flatMap((g) => g.sellingPlans.nodes),
    [product.sellingPlanGroups],
  );
  const allocations = selectedVariant?.sellingPlanAllocations?.nodes ?? [];
  // Subscribing is available for every quantity tier — it's the same real
  // monthly plan underneath regardless of how many bottles are in the order.
  const hasSubscription = plans.length > 0 && allocations.length > 0;

  const [purchaseType, setPurchaseType] = useState(
    hasSubscription ? 'subscription' : 'onetime',
  );
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id);

  const selectedAllocation = allocations.find(
    (a) => a.sellingPlan.id === selectedPlanId,
  );
  const isSubscribing =
    hasSubscription && purchaseType === 'subscription' && !!selectedAllocation;

  const subscriptionUnitCompareAtPrice =
    selectedAllocation?.priceAdjustments[0]?.compareAtPrice;

  // "Regular" per-bottle reference price — the 1-bottle tile's price is the
  // baseline every bundle discount and strikethrough is measured against.
  const regularUnitPrice = Number(QUANTITY_TILES[0].price);
  const regularTotal = regularUnitPrice * tile.units;
  const oneTimeTotal = Number(tile.price);
  const oneTimeUnitPrice = oneTimeTotal / tile.units;

  // The real selling plan only carries one flat per-bottle discount — the
  // same no matter how many bottles are in the order — so it never gets
  // cheaper per bottle on its own when the quantity tile changes. Layer the
  // bundle tier's own per-bottle savings (the same ones the one-time price
  // already uses) on top of it, so subscribing to more bottles still gets
  // cheaper per bottle too. Cosmetic like the rest of the bundle math —
  // needs matching real per-tier subscription pricing in Shopify to hold
  // at checkout (see chat for the exact setup).
  const subscriptionUnitPrice = selectedAllocation?.priceAdjustments[0]?.price;
  const subscriptionDiscountFactor = subscriptionUnitPrice
    ? Number(subscriptionUnitPrice.amount) / regularUnitPrice
    : null;
  const subscriptionUnitPriceForTile =
    subscriptionDiscountFactor != null
      ? oneTimeUnitPrice * subscriptionDiscountFactor
      : null;
  const subscriptionTotal =
    subscriptionUnitPriceForTile != null
      ? subscriptionUnitPriceForTile * tile.units
      : null;

  const selectedTotal =
    isSubscribing && subscriptionTotal != null ? subscriptionTotal : oneTimeTotal;
  const installmentAmount = (selectedTotal / 4).toFixed(2);

  const lines = selectedVariant
    ? [
        {
          merchandiseId: selectedVariant.id,
          quantity: cartQuantity,
          selectedVariant,
          ...(isSubscribing ? {sellingPlanId: selectedPlanId} : {}),
        },
      ]
    : [];

  return (
    <div className="purchase-panel">
      <h1 className="purchase-title">{product.title}</h1>

      <div className="purchase-rating">
        <span className="purchase-rating-stars" aria-hidden="true">
          {'★★★★★'.slice(0, Math.round(reviewStats.average))}
          {'★★★★★'.slice(Math.round(reviewStats.average)).replace(/★/g, '☆')}
        </span>
        <a href="#product-reviews" className="purchase-rating-count">
          {reviewStats.total} Reseñas
        </a>
      </div>

      <p className="purchase-subtitle">
        Formulado con el Complejo Probiótico Exclusivo URO® — 5 mil millones
        de UFC para un olor vaginal, pH y equilibrio de levaduras
        saludables.*
      </p>

      <span className="purchase-sold-badge">
        🔥 Más de <strong>10.000</strong> potes vendidos
      </span>

      <ProductOptionsSelector productOptions={productOptions} />

      <div className="purchase-quantity">
        <h5>Seleccionar cantidad</h5>
        <div className="purchase-quantity-grid">
          {QUANTITY_TILES.map((t, index) => {
            const tRegularTotal = regularUnitPrice * t.units;
            const savePercent =
              t.units > 1
                ? Math.round((1 - Number(t.price) / tRegularTotal) * 100)
                : null;
            return (
              <button
                key={t.units}
                type="button"
                className={`purchase-quantity-tile${tileIndex === index ? ' is-selected' : ''}`}
                onClick={() => setTileIndex(index)}
              >
                {t.ribbon ? (
                  <span
                    className={`purchase-quantity-ribbon${
                      t.ribbon === 'MEJOR VALOR' ? ' is-best-value' : ''
                    }`}
                  >
                    {t.ribbon}
                  </span>
                ) : null}
                <span className="purchase-quantity-label">{unitsLabel(t.units)}</span>
                {savePercent ? (
                  <span className="purchase-quantity-units">
                    AHORRA {savePercent}%
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="purchase-quantity-note">
          Recomendamos 2-3 meses de uso diario constante para mejores
          resultados.
        </p>
      </div>

      {hasSubscription ? (
        <div className="purchase-type">
          <h5>Selecciona tu tipo de compra</h5>
          <div className="purchase-type-options" role="radiogroup">
            <label
              className={`purchase-type-option${purchaseType === 'subscription' ? ' is-selected' : ''}`}
            >
              <input
                type="radio"
                name="purchase-type"
                checked={purchaseType === 'subscription'}
                onChange={() => setPurchaseType('subscription')}
              />
              <span className="purchase-type-option-name">
                {unitsLabel(tile.units)} · Suscripción mensual
              </span>
              <span className="purchase-type-option-price">
                {subscriptionUnitCompareAtPrice ? (
                  <s>
                    <Money data={subscriptionUnitCompareAtPrice} />
                  </s>
                ) : null}
                {subscriptionUnitPriceForTile != null ? (
                  <Money
                    data={{
                      amount: subscriptionUnitPriceForTile.toFixed(2),
                      currencyCode,
                    }}
                  />
                ) : null}
                <span className="purchase-type-option-unit">/bote</span>
              </span>

              <ul className="purchase-type-perks">
                <li>✓ Envío gratis siempre</li>
                <li>✓ Fácil de editar, pausar o cancelar cuando quieras</li>
                <li>
                  ✓{' '}
                  {tile.units === 1
                    ? '1 bote se envía cada mes'
                    : `${tile.units} botes se envían cada mes`}
                </li>
              </ul>

              {/* Placeholder — swap for the real gift/promo copy and value
                  once it's confirmed, or remove this block if there ends up
                  being no gift-with-subscription offer. */}
              <div className="purchase-gift-banner">
                🎁 <strong>Regalo gratis</strong> con tu suscripción
                <span className="purchase-gift-note"> (completar con la promo real)</span>
              </div>
            </label>

            <label
              className={`purchase-type-option${purchaseType === 'onetime' ? ' is-selected' : ''}`}
            >
              <input
                type="radio"
                name="purchase-type"
                checked={purchaseType === 'onetime'}
                onChange={() => setPurchaseType('onetime')}
              />
              <span className="purchase-type-option-name">Compra única</span>
              <span className="purchase-type-option-price">
                <s>
                  <Money data={{amount: String(regularUnitPrice), currencyCode}} />
                </s>
                <Money
                  data={{amount: oneTimeUnitPrice.toFixed(2), currencyCode}}
                />
                <span className="purchase-type-option-unit">/bote</span>
              </span>
            </label>
          </div>

          {purchaseType === 'subscription' && plans.length > 1 ? (
            <select
              className="purchase-plan-select"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              aria-label="Frecuencia de entrega"
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {planDeliveryLabel(plan)}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      ) : (
        <div aria-label="Precio" role="group" className="purchase-price">
          <Money data={{amount: oneTimeTotal.toFixed(2), currencyCode}} />
          {regularTotal > oneTimeTotal ? (
            <s className="purchase-price-compare">
              <Money data={{amount: regularTotal.toFixed(2), currencyCode}} />
            </s>
          ) : null}
        </div>
      )}

      <p className="purchase-installments">
        Solo{' '}
        <Money as="span" data={{amount: installmentAmount, currencyCode}} />{' '}
        con <span className="purchase-shop-pay-badge">Shop Pay</span> en 4
        cuotas sin interés
      </p>

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => open('cart')}
        lines={lines}
      >
        {selectedVariant?.availableForSale ? (
          <>
            Añadir al carrito -{' '}
            {regularTotal > selectedTotal ? (
              <s className="purchase-cta-compare">
                <Money data={{amount: regularTotal.toFixed(2), currencyCode}} />
              </s>
            ) : null}{' '}
            <Money data={{amount: selectedTotal.toFixed(2), currencyCode}} />
          </>
        ) : (
          'Agotado'
        )}
      </AddToCartButton>

      <p className="purchase-returns-note">Menos del 3% de clientas devuelve este producto</p>
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
