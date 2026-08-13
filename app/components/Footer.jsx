import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import {policyLabel} from '~/lib/policyLabels';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            <div className="footer-inner">
              {footer?.menu && header.shop.primaryDomain?.url && (
                <FooterMenu
                  menu={footer.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              )}

              <FooterPolicies shop={footer?.shop} />

              <p className="footer-legal">
                © {new Date().getFullYear()} {header.shop.name}. Todos los
                derechos reservados.
              </p>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * Las políticas legales, en el orden en que a una clienta le importan: primero
 * cómo contactar y qué pasa con su pedido, después la letra pequeña. Solo se
 * pintan las que existen en Shopify.
 * @param {{shop?: FooterQuery['shop']}}
 */
function FooterPolicies({shop}) {
  const policies = [
    shop?.contactInformation,
    shop?.shippingPolicy,
    shop?.refundPolicy,
    shop?.subscriptionPolicy,
    shop?.privacyPolicy,
    shop?.termsOfService,
    shop?.legalNotice,
  ].filter(Boolean);

  if (!policies.length) return null;

  return (
    <nav className="footer-policies" aria-label="Información legal">
      {policies.map((policy) => (
        <NavLink
          key={policy.id}
          to={`/policies/${policy.handle}`}
          prefetch="intent"
        >
          {policyLabel(policy)}
        </NavLink>
      ))}
    </nav>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */
function FooterMenu({menu, primaryDomainUrl, publicStoreDomain}) {
  return (
    <nav className="footer-menu" role="navigation">
      {menu.items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
