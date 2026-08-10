import heroBanner from '~/assets/hero-banner.png';

export function HeroSection() {
  return (
    <section className="hero-section">
      {/* Mobile: real heading + button on a solid pink block, cropped photo below */}
      <div className="hero-mobile">
        <div className="hero-mobile-top">
          <h1 className="hero-heading">
            <span className="hero-heading-serif">Probióticos vaginales</span>
            <span className="hero-heading-bold">
              para un olor y pH saludable*
            </span>
          </h1>
          <a href="/products/uroprob" className="hero-cta">
            Comprar ahora
          </a>
        </div>
        <div className="hero-mobile-photo">
          <img
            src={heroBanner}
            alt=""
            aria-hidden="true"
            className="hero-mobile-photo-img"
          />
        </div>
      </div>

      {/* Desktop: single flattened banner, clickable only over the baked-in button */}
      <div className="hero-desktop">
        <div className="hero-banner">
          <img
            src={heroBanner}
            alt="Probióticos vaginales para un olor y pH saludable*"
            className="hero-banner-image"
          />
          <a
            href="/products/uroprob"
            aria-label="Comprar ahora"
            className="hero-banner-cta"
          />
        </div>
      </div>
    </section>
  );
}
