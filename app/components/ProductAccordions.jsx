import {useState} from 'react';

const SECTIONS = [
  {
    id: 'for-you',
    title: '¿Es para ti?',
    content: (
      <ul className="accordion-checklist">
        <li>Buscas apoyar tu pH y flora vaginal de forma natural</li>
        <li>Has notado molestias u olor ocasional</li>
        <li>Quieres incorporar un probiótico a tu rutina diaria</li>
        <li>Prefieres un suplemento fácil de tomar, sin sabor</li>
      </ul>
    ),
  },
  {
    id: 'benefits',
    title: 'Beneficios',
    content: (
      <ul className="accordion-checklist">
        <li>Favorece el equilibrio del pH vaginal*</li>
        <li>Contribuye a un olor vaginal saludable*</li>
        <li>Ayuda a mantener el equilibrio de la flora vaginal*</li>
        <li>Apoya el bienestar de las vías urinarias*</li>
      </ul>
    ),
  },
  {
    id: 'usage',
    title: 'Modo de uso recomendado',
    content: (
      <p>
        Tomar 1 cápsula al día con un vaso de agua, preferentemente con el
        estómago vacío. Para mejores resultados, usar de forma continua
        durante 2-3 meses. Consulta con tu profesional de la salud antes de
        comenzar si estás embarazada, amamantando o tomando medicación.
      </p>
    ),
  },
  {
    id: 'ingredient-facts',
    title: 'Información de ingredientes',
    content: (
      <div className="accordion-ingredient-facts">
        <p>Por cápsula:</p>
        <ul>
          <li>Complejo Probiótico Exclusivo URO® — 5 mil millones UFC</li>
          <li>Lactobacillus acidophilus</li>
          <li>Lactobacillus rhamnosus</li>
          <li>Lactobacillus reuteri</li>
          <li>Lactobacillus fermentum</li>
          <li>Prebióticos XOS</li>
        </ul>
        <p className="accordion-ingredient-note">
          Otros ingredientes: cápsula vegetal (hipromelosa). Sin gluten, sin
          lácteos, sin OMG.
        </p>
      </div>
    ),
  },
];

/**
 * Six-ish expandable info sections, matching the reference page's
 * accordion block (minus a "Press Logos" row — we don't have real press
 * mentions to show, so we're not fabricating any).
 * @param {{descriptionHtml?: string}}
 */
export function ProductAccordions({descriptionHtml}) {
  const sections = descriptionHtml
    ? [
        {
          id: 'description',
          title: 'Descripción',
          content: <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />,
        },
        ...SECTIONS,
      ]
    : SECTIONS;
  const [openId, setOpenId] = useState(sections[0].id);

  return (
    <section className="product-accordions" aria-label="Información del producto">
      {sections.map((section) => {
        const isOpen = openId === section.id;
        return (
          <div className="product-accordion" key={section.id}>
            <button
              type="button"
              className="product-accordion-header"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : section.id)}
            >
              <span>{section.title}</span>
              <ChevronIcon open={isOpen} />
            </button>
            {isOpen ? (
              <div className="product-accordion-body">{section.content}</div>
            ) : null}
          </div>
        );
      })}
      <p className="accordion-disclaimer">
        *Estas declaraciones no han sido evaluadas por ninguna autoridad
        sanitaria. Este producto no está destinado a diagnosticar, tratar,
        curar o prevenir ninguna enfermedad.
      </p>
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
      style={{transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms'}}
    >
      <path d="m5 9 7 7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
