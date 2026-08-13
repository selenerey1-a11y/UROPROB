import {useLoaderData, Link} from 'react-router';
import {policyLabel} from '~/lib/policyLabels';

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const data = await context.storefront.query(POLICIES_QUERY);

  const shopPolicies = data.shop;
  // Mismo orden que en el pie: primero lo que afecta al pedido, después la
  // letra pequeña.
  const policies = [
    shopPolicies?.contactInformation,
    shopPolicies?.shippingPolicy,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
    shopPolicies?.privacyPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.legalNotice,
  ].filter((policy) => policy != null);

  if (!policies.length) {
    throw new Response('No policies found', {status: 404});
  }

  return {policies};
}

export default function Policies() {
  /** @type {LoaderReturnData} */
  const {policies} = useLoaderData();

  return (
    <div className="policies">
      <h1>Políticas</h1>
      <ul className="policies-list">
        {policies.map((policy) => (
          <li key={policy.id}>
            <Link to={`/policies/${policy.handle}`}>{policyLabel(policy)}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      contactInformation {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
      privacyPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      legalNotice {
        ...PolicyItem
      }
    }
  }
`;

/** @typedef {import('./+types/policies._index').Route} Route */
/** @typedef {import('storefrontapi.generated').PoliciesQuery} PoliciesQuery */
/** @typedef {import('storefrontapi.generated').PolicyItemFragment} PolicyItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
