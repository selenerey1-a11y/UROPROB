import {Await, useLoaderData} from 'react-router';
import {Suspense} from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductGallery} from '~/components/ProductGallery';
import {ProductPurchasePanel} from '~/components/ProductPurchasePanel';
import {ProductVideoSection} from '~/components/ProductVideoSection';
import {TickerSection} from '~/components/TickerSection';
import {TestimonialsSection} from '~/components/TestimonialsSection';
import {ScienceSection} from '~/components/ScienceSection';
import {IngredientsSection} from '~/components/IngredientsSection';
import {ProductAddOns} from '~/components/ProductAddOns';
import {ProductReviewsSection} from '~/components/ProductReviewsSection';
import {ProductAccordions} from '~/components/ProductAccordions';
import {ProductFaq} from '~/components/ProductFaq';
import {ProductRelated} from '~/components/ProductRelated';
import {ProductBlogSection} from '~/components/ProductBlogSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

// Trust-building banner that closes the video carousel and leads into the
// FAQ, which now answers the buyer's objections before the photo testimonials.
const TRUST_TICKER_ITEMS = [
  '+10.000 clientas satisfechas',
  '★★★★★ Valorado 4.8/5',
  'Ingredientes 100% veganos',
  'Envío discreto',
];

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `UROprob | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context, params}) {
  const {storefront} = context;
  const {handle} = params;

  // Complementary products + "explore our products" grid — both pull from
  // the same recently-updated products list, excluding the current product.
  const otherProducts = storefront
    .query(OTHER_PRODUCTS_QUERY)
    .then(({products}) =>
      (products.nodes || []).filter((p) => p.handle !== handle),
    )
    .catch((error) => {
      console.error(error);
      return [];
    });

  const addOns = otherProducts.then((products) => products.slice(0, 2));
  const relatedProducts = otherProducts.then((products) => products.slice(0, 6));

  const blogArticles = storefront
    .query(BLOG_ARTICLES_QUERY)
    .then(({blogs}) => blogs.nodes[0]?.articles.nodes || [])
    .catch((error) => {
      console.error(error);
      return [];
    });

  return {
    addOns,
    relatedProducts,
    blogArticles,
  };
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, addOns, relatedProducts, blogArticles} = useLoaderData();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {descriptionHtml} = product;
  const images = product.images?.nodes ?? [];

  return (
    <div className="product-page">
      <div className="product-top">
        <ProductGallery
          images={images}
          selectedVariantImage={selectedVariant?.image}
          title={product.title}
        />
        <ProductPurchasePanel
          product={product}
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />
      </div>

      <ProductVideoSection />
      <TickerSection items={TRUST_TICKER_ITEMS} />
      <ProductFaq />
      <TestimonialsSection />

      <Suspense fallback={null}>
        <Await resolve={addOns}>
          {(products) => <ProductAddOns products={products} />}
        </Await>
      </Suspense>

      <ScienceSection />
      <IngredientsSection />
      <ProductReviewsSection />
      <ProductAccordions descriptionHtml={descriptionHtml} />

      <Suspense fallback={null}>
        <Await resolve={relatedProducts}>
          {(products) => <ProductRelated products={products} />}
        </Await>
      </Suspense>

      <Suspense fallback={null}>
        <Await resolve={blogArticles}>
          {(articles) => <ProductBlogSection articles={articles} />}
        </Await>
      </Suspense>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    sellingPlanAllocations(first: 10) {
      nodes {
        sellingPlan {
          id
          name
        }
        priceAdjustments {
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          perDeliveryPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 8) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    sellingPlanGroups(first: 5) {
      nodes {
        name
        sellingPlans(first: 5) {
          nodes {
            id
            name
            recurringDeliveries
            deliveryPolicy {
              ... on SellingPlanRecurringDeliveryPolicy {
                interval
                intervalCount
              }
            }
          }
        }
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

// Backs both the "complete tu rutina" add-ons and the "explora nuestros
// productos" grid below the fold — the current product is filtered out
// client-side after the fetch.
const OTHER_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query OtherProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 9, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

// Powers the "El blog diario" section — pulls the first blog's most
// recent articles. Renders nothing if the shop has no blog yet.
const BLOG_ARTICLES_QUERY = `#graphql
  query ProductPageBlogArticles($language: LanguageCode)
    @inContext(language: $language) {
    blogs(first: 1) {
      nodes {
        handle
        articles(first: 3, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            image {
              id
              url
              altText
              width
              height
            }
            blog {
              handle
            }
          }
        }
      }
    }
  }
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
