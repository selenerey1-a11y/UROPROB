import {useState} from 'react';
import ingredientsHeroImage from '~/assets/ingredients-hero.png';

const STRAINS = [
  {
    name: 'Lactobacillus acidophilus',
    desc: 'Ayuda a combatir molestias vaginales y digestivas*',
  },
  {
    name: 'Lactobacillus rhamnosus',
    desc: 'Favorece el equilibrio de la flora vaginal y gastrointestinal*',
  },
  {
    name: 'Lactobacillus reuteri',
    desc: 'Tiene propiedades que refuerzan las defensas*',
  },
  {
    name: 'Lactobacillus fermentum',
    desc: 'Contribuye a mantener un pH vaginal saludable*',
  },
];

export function IngredientsSection() {
  const [open, setOpen] = useState(true);

  return (
    <section className="ingredients-section">
      <div className="ingredients-hero">
        <img
          src={ingredientsHeroImage}
          alt="Cápsula de UROprob abierta, mostrando el polvo probiótico"
          className="ingredients-hero-image"
        />
      </div>

      <div className="ingredients-body">
        <h2 className="ingredients-title">Ingredientes clave:</h2>

        <div className={`ingredients-timeline${open ? '' : ' is-closed'}`}>
          <div className="ingredients-row">
            <span className="ingredients-badge" aria-hidden="true">
              <SwirlIcon />
            </span>
            <button
              type="button"
              className="ingredients-accordion-header"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
            >
              <span className="ingredients-blend-name">
                Complejo Probiótico Exclusivo URO®
              </span>
              <ChevronIcon open={open} />
            </button>
          </div>

          {open ? (
            <>
              <div className="ingredients-row">
                <span className="ingredients-col-spacer" aria-hidden="true" />
                <p className="ingredients-blend-desc">
                  4 cepas potentes con 5 mil millones de UFC para una
                  protección reforzada.
                </p>
              </div>

              {STRAINS.map((strain) => (
                <div key={strain.name} className="ingredients-row">
                  <span className="ingredients-dot-col" aria-hidden="true">
                    <span className="ingredients-dot" />
                  </span>
                  <div>
                    <p className="ingredients-strain-name">{strain.name}</p>
                    <p className="ingredients-strain-desc">{strain.desc}</p>
                  </div>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ChevronIcon({open}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="ingredients-chevron"
      style={{transform: open ? 'rotate(0deg)' : 'rotate(180deg)'}}
    >
      <path d="m5 15 7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SwirlIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4a8 8 0 1 1-5.66 2.34"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 8a4 4 0 1 1-2.83 1.17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
