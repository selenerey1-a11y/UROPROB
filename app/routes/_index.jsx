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
  return [
    {title: 'UROPROB | Probiótico vaginal para el equilibrio íntimo'},
    {
      name: 'description',
      content:
        'Complejo Probiótico Exclusivo URO® con 5 mil millones de UFC para un olor vaginal, pH y equilibrio de levaduras saludables. Envíos nacionales en 24-48 h.',
    },
  ];
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
