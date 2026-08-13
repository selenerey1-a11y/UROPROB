// La Storefront API devuelve el título canónico del tipo de política, siempre
// en inglés ("Shipping Policy", "Legal Notice"), y no el que se escribe en el
// admin de Shopify — ese solo sale por la Admin API. Como toda la tienda está
// en español, las etiquetas visibles se fijan aquí, con el título que venga de
// la API como reserva por si algún día aparece un tipo nuevo.
//
// Ojo: renombrar una política en Shopify NO cambia lo que se ve aquí. Si
// quieres otro texto, cámbialo en este mapa.
const POLICY_LABELS = {
  'contact-information': 'Contacto',
  'shipping-policy': 'Envío',
  'refund-policy': 'Devoluciones y reembolsos',
  'subscription-policy': 'Cancelaciones y suscripciones',
  'privacy-policy': 'Política de privacidad',
  'terms-of-service': 'Términos del servicio',
  'legal-notice': 'Aviso legal',
};

/**
 * @param {{handle?: string | null; title?: string | null}} policy
 * @returns {string}
 */
export function policyLabel(policy) {
  return POLICY_LABELS[policy?.handle] ?? policy?.title ?? '';
}
