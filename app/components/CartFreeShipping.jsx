import {Money} from '@shopify/hydrogen';

// Real free-shipping threshold — must match whatever free-shipping rule is
// actually configured in Shopify (order amount discount / shipping rate),
// otherwise this promises something checkout won't honor.
const FREE_SHIPPING_THRESHOLD = 39.99;

/**
 * Progress bar toward free shipping, shown above the cart line items.
 * @param {{subtotal?: {amount: string; currencyCode: string} | null}}
 */
export function CartFreeShipping({subtotal}) {
  const currencyCode = subtotal?.currencyCode || 'EUR';
  const subtotalAmount = Number(subtotal?.amount || 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalAmount);
  const progress = Math.min(
    100,
    (subtotalAmount / FREE_SHIPPING_THRESHOLD) * 100,
  );
  const qualifies = remaining <= 0;

  return (
    <div
      className={`cart-free-shipping${qualifies ? ' is-unlocked' : ''}`}
      // Keeps the fill, the glow and the goal marker in sync from one source.
      style={{'--cart-shipping-progress': `${progress}%`}}
    >
      <div className="cart-free-shipping-head">
        <span className="cart-free-shipping-icon" aria-hidden="true">
          {qualifies ? <CheckIcon /> : <TruckIcon />}
        </span>
        <p className="cart-free-shipping-message">
          {qualifies ? (
            <>
              ¡Genial! Tienes{' '}
              <span className="cart-free-shipping-highlight">envío gratis</span>{' '}
              🎉
            </>
          ) : (
            <>
              Te faltan{' '}
              <span className="cart-free-shipping-amount">
                <Money
                  as="span"
                  data={{amount: remaining.toFixed(2), currencyCode}}
                />
              </span>{' '}
              para el{' '}
              <span className="cart-free-shipping-highlight">envío gratis</span>
            </>
          )}
        </p>
      </div>

      <div className="cart-free-shipping-track-row">
        <div
          className="cart-free-shipping-bar"
          role="progressbar"
          aria-label="Progreso hacia el envío gratis"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="cart-free-shipping-bar-fill" />
        </div>
        <span className="cart-free-shipping-goal">
          <Money
            as="span"
            data={{
              amount: FREE_SHIPPING_THRESHOLD.toFixed(2),
              currencyCode,
            }}
          />
        </span>
      </div>
    </div>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M3 7.5A1.5 1.5 0 0 1 4.5 6h8A1.5 1.5 0 0 1 14 7.5V16H3V7.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 10h3.2c.5 0 .96.25 1.24.66L21 14.2V16h-7v-6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17.5" r="1.9" stroke="currentColor" strokeWidth="1.6" />
      <circle
        cx="17"
        cy="17.5"
        r="1.9"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
