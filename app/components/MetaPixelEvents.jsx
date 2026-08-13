import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

export function MetaPixelEvents() {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('Meta Pixel');

  useEffect(() => {
    subscribe('page_viewed', () => {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
      }
    });

    subscribe('product_viewed', ({products}) => {
      if (typeof window.fbq === 'function' && products?.length) {
        const product = products[0];
        window.fbq('track', 'ViewContent', {
          content_ids: [product.variantId || product.id],
          content_type: 'product',
          value: product.price,
          currency: 'EUR',
        });
      }
    });

    subscribe('product_added_to_cart', ({currentLine}) => {
      if (typeof window.fbq === 'function' && currentLine) {
        window.fbq('track', 'AddToCart', {
          content_ids: [currentLine.merchandise?.id],
          content_type: 'product',
          value: parseFloat(currentLine.cost?.totalAmount?.amount || 0),
          currency: currentLine.cost?.totalAmount?.currencyCode || 'EUR',
        });
      }
    });

    ready();
  }, [subscribe, register, ready]);

  return null;
}
