/**
 * Free-shipping banner shown above the cart line items. Shopify ships every
 * order free, so this is a plain confirmation — there is no threshold left to
 * make progress towards.
 */
export function CartFreeShipping() {
  return (
    <div className="cart-free-shipping">
      <div className="cart-free-shipping-head">
        <span className="cart-free-shipping-icon" aria-hidden="true">
          <TruckIcon />
        </span>
        <p className="cart-free-shipping-message">
          <span className="cart-free-shipping-highlight">Envío gratis</span> en
          todos los pedidos 🎉
        </p>
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
