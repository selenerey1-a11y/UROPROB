import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

  // Con algo ya aplicado el desplegable arranca abierto para que se vea.
  const hasAppliedCodes =
    (cart?.discountCodes?.some((discount) => discount.applicable) ?? false) ||
    (cart?.appliedGiftCards?.length ?? 0) > 0;

  // Subtotal y Total solo se diferencian cuando hay un descuento o una tarjeta
  // regalo en juego. Mientras coinciden, enseñar las dos filas con la misma
  // cifra es ruido, así que el subtotal aparece únicamente cuando aporta algo.
  const subtotalAmount = cart?.cost?.subtotalAmount;
  const totalAmount = cart?.cost?.totalAmount;
  const showSubtotal =
    !!subtotalAmount?.amount &&
    (!totalAmount?.amount ||
      Number(subtotalAmount.amount) !== Number(totalAmount.amount));

  return (
    <div aria-label="Resumen del pedido" className={`${className} cart-summary`}>
      {showSubtotal ? (
        <dl role="group" className="cart-summary-row cart-subtotal">
          <dt>Subtotal</dt>
          <dd>
            <Money data={subtotalAmount} />
          </dd>
        </dl>
      ) : null}
      <dl role="group" className="cart-summary-row cart-total">
        <dt>Total</dt>
        <dd>{totalAmount?.amount ? <Money data={totalAmount} /> : '-'}</dd>
      </dl>
      <details className="cart-summary-codes" open={hasAppliedCodes}>
        <summary className="cart-summary-codes-toggle">
          Código de descuento o tarjeta regalo
        </summary>
        <div className="cart-summary-codes-body">
          <CartDiscounts
            discountCodes={cart?.discountCodes}
            discountsHeadingId={discountsHeadingId}
            discountCodeInputId={discountCodeInputId}
          />
          <CartGiftCard
            giftCardCodes={cart?.appliedGiftCards}
            giftCardHeadingId={giftCardHeadingId}
            giftCardInputId={giftCardInputId}
          />
        </div>
      </details>
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <a href={checkoutUrl} target="_self" className="cart-checkout-button">
      Continuar al pago →
    </a>
  );
}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 *   discountsHeadingId: string;
 *   discountCodeInputId: string;
 * }}
 */
function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <section aria-label="Descuentos" className="cart-summary-code-section">
      {/* Have existing discount, display it with a remove option */}
      {codes.length > 0 ? (
        <div>
          <p id={discountsHeadingId} className="cart-summary-code-label">
            Descuento aplicado
          </p>
          <UpdateDiscountForm>
            <div className="cart-summary-chip" aria-labelledby={discountsHeadingId}>
              <code>{codes?.join(', ')}</code>
              <button type="submit" aria-label="Quitar descuento">
                ×
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      ) : null}

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="cart-summary-code-form">
          <label htmlFor={discountCodeInputId} className="sr-only">
            Código de descuento
          </label>
          <input
            id={discountCodeInputId}
            className="cart-summary-code-input"
            type="text"
            name="discountCode"
            placeholder="Código de descuento"
          />
          <button
            type="submit"
            className="cart-summary-code-apply"
            aria-label="Aplicar código de descuento"
          >
            Aplicar
          </button>
        </div>
      </UpdateDiscountForm>
    </section>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 *   giftCardHeadingId: string;
 *   giftCardInputId: string;
 * }}
 */
function CartGiftCard({giftCardCodes, giftCardHeadingId, giftCardInputId}) {
  const giftCardCodeInput = useRef(null);
  const removeButtonRefs = useRef(new Map());
  const previousCardIdsRef = useRef([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState(null);

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      if (giftCardCodeInput.current !== null) {
        giftCardCodeInput.current.value = '';
      }
    }
  }, [giftCardAddFetcher.data]);

  useEffect(() => {
    const currentCardIds = giftCardCodes?.map((card) => card.id) || [];

    if (removedCardIndex !== null && giftCardCodes) {
      const focusTargetIndex = Math.min(
        removedCardIndex,
        giftCardCodes.length - 1,
      );
      const focusTargetCard = giftCardCodes[focusTargetIndex];
      const focusButton = focusTargetCard
        ? removeButtonRefs.current.get(focusTargetCard.id)
        : null;

      if (focusButton) {
        focusButton.focus();
      } else if (giftCardCodeInput.current) {
        giftCardCodeInput.current.focus();
      }

      setRemovedCardIndex(null);
    }

    previousCardIdsRef.current = currentCardIds;
  }, [giftCardCodes, removedCardIndex]);

  const handleRemoveClick = (cardId) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) {
      setRemovedCardIndex(index);
    }
  };

  return (
    <section aria-label="Tarjetas regalo" className="cart-summary-code-section">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <div>
          <p id={giftCardHeadingId} className="cart-summary-code-label">
            Tarjeta(s) de regalo aplicada(s)
          </p>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm
              key={giftCard.id}
              giftCardId={giftCard.id}
              lastCharacters={giftCard.lastCharacters}
              onRemoveClick={() => handleRemoveClick(giftCard.id)}
              buttonRef={(el) => {
                if (el) {
                  removeButtonRefs.current.set(giftCard.id, el);
                } else {
                  removeButtonRefs.current.delete(giftCard.id);
                }
              }}
            >
              <code aria-labelledby={giftCardHeadingId}>
                ***{giftCard.lastCharacters} · <Money data={giftCard.amountUsed} />
              </code>
            </RemoveGiftCardForm>
          ))}
        </div>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="cart-summary-code-form">
          <label htmlFor={giftCardInputId} className="sr-only">
            Código de tarjeta regalo
          </label>
          <input
            id={giftCardInputId}
            className="cart-summary-code-input"
            type="text"
            name="giftCardCode"
            placeholder="Código de tarjeta regalo"
            ref={giftCardCodeInput}
          />
          <button
            type="submit"
            className="cart-summary-code-apply"
            disabled={giftCardAddFetcher.state !== 'idle'}
            aria-label="Aplicar código de tarjeta regalo"
          >
            Aplicar
          </button>
        </div>
      </AddGiftCardForm>
    </section>
  );
}

/**
 * @param {{
 *   fetcherKey?: string;
 *   children: React.ReactNode;
 * }}
 */
function AddGiftCardForm({fetcherKey, children}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardId: string;
 *   lastCharacters: string;
 *   children: React.ReactNode;
 *   onRemoveClick?: () => void;
 *   buttonRef?: (el: HTMLButtonElement | null) => void;
 * }}
 */
function RemoveGiftCardForm({
  giftCardId,
  lastCharacters,
  children,
  onRemoveClick,
  buttonRef,
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      <div className="cart-summary-chip">
        {children}
        <button
          type="submit"
          aria-label={`Quitar tarjeta regalo terminada en ${lastCharacters}`}
          onClick={onRemoveClick}
          ref={buttonRef}
        >
          ×
        </button>
      </div>
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
