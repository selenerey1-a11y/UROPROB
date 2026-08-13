import {Link, useLoaderData} from 'react-router';
import {policyLabel} from '~/lib/policyLabels';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `UROprob | ${data?.policy ? policyLabel(data.policy) : ''}`}];
};

/**
 * @param {Route.LoaderArgs}
 */
// Los siete tipos de política que expone la Storefront API. La plantilla solo
// contemplaba cuatro, así que /policies/subscription-policy, /legal-notice y
// /contact-information daban 404 aunque estuvieran redactadas en Shopify.
const POLICY_FIELDS = [
  'contactInformation',
  'shippingPolicy',
  'refundPolicy',
  'subscriptionPolicy',
  'privacyPolicy',
  'termsOfService',
  'legalNotice',
];

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({params, context}) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = params.handle.replace(/-([a-z])/g, (_, m1) =>
    m1.toUpperCase(),
  );

  // Cada @include necesita su variable declarada, así que se mandan las siete
  // siempre: la pedida en true y el resto en false.
  if (!POLICY_FIELDS.includes(policyName)) {
    throw new Response('Could not find the policy', {status: 404});
  }

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      ...Object.fromEntries(
        POLICY_FIELDS.map((field) => [field, field === policyName]),
      ),
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', {status: 404});
  }

  return {policy};
}

export default function Policy() {
  /** @type {LoaderReturnData} */
  const {policy} = useLoaderData();

  return (
    <div className="policy">
      <Link to="/policies" className="policy-back">
        ← Volver a las políticas
      </Link>
      <h1>{policyLabel(policy)}</h1>
      <div
        className="policy-body"
        dangerouslySetInnerHTML={{__html: policy.body}}
      />
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $contactInformation: Boolean!
    $legalNotice: Boolean!
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $subscriptionPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      contactInformation @include(if: $contactInformation) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
      subscriptionPolicy @include(if: $subscriptionPolicy) {
        body
        handle
        id
        title
        url
      }
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      legalNotice @include(if: $legalNotice) {
        ...Policy
      }
    }
  }
`;

/**
 * @typedef {keyof Pick<
 *   Shop,
 *   | 'contactInformation'
 *   | 'shippingPolicy'
 *   | 'refundPolicy'
 *   | 'subscriptionPolicy'
 *   | 'privacyPolicy'
 *   | 'termsOfService'
 *   | 'legalNotice'
 * >} SelectedPolicies
 */

/** @typedef {import('./+types/policies.$handle').Route} Route */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Shop} Shop */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
