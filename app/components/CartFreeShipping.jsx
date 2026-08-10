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
    <div className="cart-free-shipping">
      <p className="cart-free-shipping-message">
        {qualifies ? (
          <span className="cart-free-shipping-highlight">
            ¡ENVÍO GRATIS conseguido! 🎉
          </span>
        ) : (
          <>
            <span className="cart-free-shipping-highlight">ENVÍO GRATIS</span>{' '}
            a solo{' '}
            <span className="cart-free-shipping-highlight">
              <Money data={{amount: remaining.toFixed(2), currencyCode}} />
            </span>{' '}
            de distancia
          </>
        )}
      </p>
      <div
        className="cart-free-shipping-bar"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="cart-free-shipping-bar-fill"
          style={{width: `${progress}%`}}
        />
      </div>
    </div>
  );
}
