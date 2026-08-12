import {useEffect} from 'react';
import {useLocation} from '@remix-run/react';

export function useMetaPixelPageView() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname, location.search]);
}
