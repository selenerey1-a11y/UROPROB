const INTERVAL_ES = {
  DAY: ['día', 'días'],
  WEEK: ['semana', 'semanas'],
  MONTH: ['mes', 'meses'],
  YEAR: ['año', 'años'],
};

/**
 * Builds a Spanish delivery-frequency label ("Entrega cada mes") from a
 * selling plan's real deliveryPolicy interval, instead of showing whatever
 * (often English) name was typed into Shopify Admin.
 * @param {{name?: string; deliveryPolicy?: {interval?: string; intervalCount?: number}}} plan
 */
export function planDeliveryLabel(plan) {
  const policy = plan?.deliveryPolicy;
  if (!policy?.interval) return plan?.name || 'Entrega periódica';
  const count = policy.intervalCount || 1;
  const [singular, plural] = INTERVAL_ES[policy.interval] || ['mes', 'meses'];
  return count > 1
    ? `Entrega cada ${count} ${plural}`
    : `Entrega cada ${singular}`;
}
