import superchargePhoto from '~/assets/supercharge-photo.png';
import superchargeDesktopPhoto from '~/assets/supercharge-desktop-photo.png';

export function SuperchargeSection() {
  return (
    <section className="supercharge-section">
      {/* Mobile: the flattened portrait photo (text baked in) */}
      <div className="supercharge-mobile">
        <div className="supercharge-banner">
          <img
            src={superchargePhoto}
            alt="Potencia tu zona íntima — Los ingredientes de URO actúan donde importa, para apoyar pH vaginal, olor vaginal, equilibrio de levaduras y flora vaginal"
            className="supercharge-banner-image"
          />
          <a
            href="/products/uroprob"
            aria-label="Comprar ahora"
            className="supercharge-banner-cta"
          />
        </div>
      </div>

      {/* Desktop: the flattened wide photo (text baked in), same treatment */}
      <div className="supercharge-desktop">
        <div className="supercharge-desktop-banner">
          <img
            src={superchargeDesktopPhoto}
            alt="Potencia tu zona íntima — Los ingredientes de URO actúan donde importa, para apoyar pH vaginal, olor vaginal, equilibrio de levaduras y flora vaginal"
            className="supercharge-desktop-banner-image"
          />
          <a
            href="/products/uroprob"
            aria-label="Comprar ahora"
            className="supercharge-desktop-banner-cta"
          />
        </div>
      </div>
    </section>
  );
}
