import {useMemo, useState} from 'react';
import {useNavigate} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {ProductOptionsSelector} from './ProductOptionsSelector';
import {planDeliveryLabel} from '~/lib/sellingPlan';
import {REVIEWS, getReviewStats} from '~/lib/placeholderReviews';

const reviewStats = getReviewStats(REVIEWS);

// Ribbons are per bundle position, not per price — the second tier is the one
// we push and the last is the cheapest per bottle.
const TILE_RIBBONS = [null, 'RECOMENDADO', 'MEJOR VALOR'];

// The bundles are real Shopify *variants* ("Formato": 1/2/3 Botes, priced
// 29,99 / 39,99 / 49,99), not a quantity of the single-bottle variant. So a
// tile has to switch the selected variant and always add quantity 1 — adding
// quantity N of the 1-bottle variant charges N x 29,99 at checkout instead of
// the bundle price. Every number on this panel is therefore read straight off
// the variant and its selling-plan allocation; nothing is hardcoded or
// recomputed here, which is what keeps the display and checkout in agreement.
function bundleUnits(name, index) {
  const match = /\d+/.exec(name);
  return match ? Number(match[0]) : index + 1;
}

function unitsLabel(units) {
  return units === 1 ? '1 Bote' : `${units} Botes`;
}

/**
 * The full buy-box: rating link, title, formulated-with line, sold badge,
 * variant options, flat-price quantity tiers, a subscribe-and-save vs
 * one-time purchase choice (available for every quantity tier), an
 * installments hint, and the add-to-cart action with the live total.
 *
 * Subscription pricing comes straight from the product's real
 * sellingPlanGroups/sellingPlanAllocations — nothing is fabricated there;
 * the same monthly plan applies no matter which bundle is selected.
 * @param {{
 *   product: ProductFragment;
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductPurchasePanel({product, productOptions, selectedVariant}) {
  const {open} = useAside();
  const navigate = useNavigate();

  // The first multi-value option is the bundle picker, rendered as the price
  // tiles below; anything else (a flavour, a scent) still goes through the
  // normal option selector.
  const bundleOption = productOptions.find((o) => o.optionValues.length > 1);
  const otherOptions = productOptions.filter((o) => o !== bundleOption);

  const tiles = (bundleOption?.optionValues ?? []).map((value, index) => ({
    ...value,
    units: bundleUnits(value.name, index),
    ribbon: TILE_RIBBONS[index] ?? null,
    price: Number(value.firstSelectableVariant?.price?.amount ?? 0),
  }));

  const tile = tiles.find((t) => t.selected) ?? tiles[0];
  const units = tile?.units ?? 1;
  const currencyCode = selectedVariant?.price?.currencyCode || 'EUR';

  const plans = useMemo(
    () => (product.sellingPlanGroups?.nodes ?? []).flatMap((g) => g.sellingPlans.nodes),
    [product.sellingPlanGroups],
  );
  const allocations = selectedVariant?.sellingPlanAllocations?.nodes ?? [];
  // Subscribing is available for every bundle — it's the same real monthly
  // plan underneath regardless of how many bottles the variant holds.
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

  // "Regular" per-bottle reference price — the 1-bottle tile is the baseline
  // every bundle saving and strikethrough is measured against.
  const regularUnitPrice = tiles.length
    ? tiles[0].price / tiles[0].units
    : Number(selectedVariant?.price?.amount ?? 0);
  const regularTotal = regularUnitPrice * units;

  // Bundle price = the variant's own price. Subscription price = whatever the
  // selling plan allocates for that same variant (a 10% policy today, but the
  // allocation is authoritative whatever the policy becomes). Both are the
  // totals for the whole bundle, so checkout cannot disagree with them.
  const oneTimeTotal = Number(
    selectedVariant?.price?.amount ?? tile?.price ?? 0,
  );
  const subscriptionAmount = selectedAllocation?.priceAdjustments[0]?.price?.amount;
  const subscriptionTotal =
    subscriptionAmount != null ? Number(subscriptionAmount) : null;

  const selectedTotal =
    isSubscribing && subscriptionTotal != null ? subscriptionTotal : oneTimeTotal;
  const installmentAmount = (selectedTotal / 4).toFixed(2);

  const lines = selectedVariant
    ? [
        {
          merchandiseId: selectedVariant.id,
          quantity: 1,
          selectedVariant,
          ...(isSubscribing ? {sellingPlanId: selectedPlanId} : {}),
        },
      ]
    : [];

  function selectTile(t) {
    if (t.selected) return;
    const to = t.isDifferentProduct
      ? `/products/${t.handle}?${t.variantUriQuery}`
      : `?${t.variantUriQuery}`;
    void navigate(to, {replace: true, preventScrollReset: true});
  }

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

      <div className="purchase-badges">
        <span className="purchase-sold-badge">
          🔥 Más de <strong>10.000</strong> botes vendidos
        </span>
        <span className="purchase-cod-badge">
          💵 <strong>100% contrareembolso</strong>, tu confianza nos importa
        </span>
      </div>

      <ProductOptionsSelector productOptions={otherOptions} />

      <div className="purchase-quantity">
        <h5>Seleccionar cantidad</h5>
        <div className="purchase-quantity-grid">
          {tiles.map((t) => {
            const tRegularTotal = regularUnitPrice * t.units;
            const savePercent =
              t.units > 1 && tRegularTotal > 0
                ? Math.round((1 - t.price / tRegularTotal) * 100)
                : null;
            return (
              <button
                key={t.name}
                type="button"
                disabled={!t.exists}
                className={`purchase-quantity-tile${t.selected ? ' is-selected' : ''}`}
                style={{opacity: t.available ? 1 : 0.3}}
                onClick={() => selectTile(t)}
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
                {unitsLabel(units)} · Suscripción mensual
              </span>
              <span className="purchase-type-option-price">
                <s>
                  <Money
                    as="span"
                    data={{amount: regularUnitPrice.toFixed(2), currencyCode}}
                  />
                </s>
                {subscriptionTotal != null ? (
                  <Money
                    as="span"
                    data={{
                      amount: (subscriptionTotal / units).toFixed(2),
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
                  {units === 1
                    ? '1 bote se envía cada mes'
                    : `${units} botes se envían cada mes`}
                </li>
              </ul>

              <p className="purchase-type-note">
                💳 La suscripción solo se puede pagar con tarjeta, ya que la
                renovación es automática cada mes. Si prefieres el
                contrareembolso, elige <strong>Compra única</strong>.
              </p>
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
                  <Money
                    as="span"
                    data={{amount: regularUnitPrice.toFixed(2), currencyCode}}
                  />
                </s>
                <Money
                  as="span"
                  data={{amount: (oneTimeTotal / units).toFixed(2), currencyCode}}
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
        analytics={{
          products: [
            {
              id: selectedVariant?.id,
              title: product.title,
              // El pack es la variante y va de uno en uno, así que el importe
              // que se reporta es el total real de la línea — con suscripción
              // no coincide con variant.price.
              price: selectedTotal.toFixed(2),
              vendor: product.vendor,
              variantId: selectedVariant?.id,
              variantTitle: selectedVariant?.title,
              quantity: 1,
            },
          ],
        }}
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
