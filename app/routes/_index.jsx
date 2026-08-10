import {useLoaderData} from 'react-router';
import {MockShopNotice} from '~/components/MockShopNotice';
import {HeroSection} from '~/components/HeroSection';
import {TickerSection} from '~/components/TickerSection';
import {SuperchargeSection} from '~/components/SuperchargeSection';
import {TestimonialsSection} from '~/components/TestimonialsSection';
import {ProductReviewsSection} from '~/components/ProductReviewsSection';
import {ScienceSection} from '~/components/ScienceSection';
import {IngredientsSection} from '~/components/IngredientsSection';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({context}) {
  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      <HeroSection />
      <TickerSection />
      <SuperchargeSection />
      <TestimonialsSection />
      <ScienceSection />
      <IngredientsSection />
      <ProductReviewsSection />
      {data.isShopLinked ? null : <MockShopNotice />}
    </div>
  );
}

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
