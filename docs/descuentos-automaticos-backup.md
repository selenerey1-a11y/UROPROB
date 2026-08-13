# Backup: descuentos automáticos de bundle (desactivados 2026-08-13)

Estos dos descuentos implementaban el precio de pack por **cantidad** sobre la
variante "1 Bote". Se desactivaron al pasar los packs a variantes reales
("Formato": 1/2/3 Botes, con su propio precio), porque:

- Ya no hacían falta: el precio del pack es el precio de la variante.
- Rompían las suscripciones: el descuento se aplicaba al primer cobro pero no a
  las renovaciones, así que un pack de 2 botes se cobraba a 33,99 € el primer
  mes y a 53,98 € los siguientes.
- Con packs por variante pasaban a ser peligrosos: cantidad 2 del pack
  "2 Botes" (79,98 €) cumple el mínimo de 2 unidades y se llevaba un −19,99 €
  no intencionado.

Si hiciera falta reactivarlos, esta era su configuración exacta:

## UROprob – 2 Botes (-19,99€)

    id                        gid://shopify/DiscountAutomaticNode/2282075488591
    startsAt                  2026-08-09T00:00:00Z
    endsAt                    null
    valor                     19,99 EUR fijo, appliesOnEachItem: false
    aplica a                  producto UROprob (gid://shopify/Product/16264068432207)
    mínimo                    cantidad >= 2
    appliesOnOneTimePurchase  true
    appliesOnSubscription     true
    recurringCycleLimit       0
    combinesWith              order: false, product: false, shipping: false

## UROprob – 3 Botes (-39,98€)

    id                        gid://shopify/DiscountAutomaticNode/2282075521359
    startsAt                  2026-08-09T00:00:00Z
    endsAt                    null
    valor                     39,98 EUR fijo, appliesOnEachItem: false
    aplica a                  producto UROprob (gid://shopify/Product/16264068432207)
    mínimo                    cantidad >= 3
    appliesOnOneTimePurchase  true
    appliesOnSubscription     true
    recurringCycleLimit       0
    combinesWith              order: false, product: false, shipping: false
