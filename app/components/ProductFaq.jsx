import {useState} from 'react';

const TABS = [
  {
    id: 'product',
    label: 'Producto',
    questions: [
      {
        q: '¿Qué es URO Probiótico Vaginal?',
        a: 'Es un suplemento diario en cápsulas con cepas de Lactobacillus y prebióticos XOS, pensado para apoyar el equilibrio del pH y la flora vaginal.',
      },
      {
        q: '¿Puedo tomarlo junto con otros suplementos?',
        a: 'En general sí, pero te recomendamos consultar con tu profesional de la salud si ya tomás otros suplementos o medicación.',
      },
      {
        q: '¿A partir de qué edad se puede tomar?',
        a: 'Está pensado para personas adultas. No recomendamos su uso en menores sin supervisión médica.',
      },
      {
        q: '¿Cuánto tiempo tarda en notarse el efecto?',
        a: 'Cada organismo es distinto; muchas clientas reportan notar cambios dentro de las primeras 2 a 4 semanas de uso continuo.',
      },
    ],
  },
  {
    id: 'shipping',
    label: 'Envío',
    questions: [
      {
        q: '¿Cuánto tarda en llegar mi pedido?',
        a: 'Los envíos nacionales suelen demorar entre 24 y 48 horas hábiles desde la confirmación de la compra.',
      },
      {
        q: '¿Puedo hacer seguimiento de mi pedido?',
        a: 'Sí, te enviamos un correo con el número de seguimiento apenas tu pedido sale del depósito.',
      },
    ],
  },
  {
    id: 'other',
    label: 'Otros',
    questions: [
      {
        q: '¿Cómo cancelo o modifico mi suscripción?',
        a: 'Podés gestionar tu suscripción (pausar, cambiar frecuencia o cancelar) desde tu cuenta en cualquier momento.',
      },
      {
        q: '¿Cuál es la política de devoluciones?',
        a: 'Consultá nuestra política de devoluciones y reembolsos en el pie de página para conocer todos los detalles.',
      },
    ],
  },
];

export function ProductFaq() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [openIndex, setOpenIndex] = useState(0);
  const tab = TABS.find((t) => t.id === activeTab);

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="faq-title">
        Preguntas frecuentes
      </h2>

      <div className="faq-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === activeTab}
            className={`faq-tab${t.id === activeTab ? ' is-active' : ''}`}
            onClick={() => {
              setActiveTab(t.id);
              setOpenIndex(0);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {tab.questions.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div className="faq-item" key={item.q}>
              <button
                type="button"
                className="faq-question"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span>{item.q}</span>
                <ChevronIcon open={isOpen} />
              </button>
              {isOpen ? <p className="faq-answer">{item.a}</p> : null}
            </div>
          );
        })}
      </div>

      <a href="/pages/contact" className="faq-ask-link">
        ¿Tenés otra pregunta? Contactanos
      </a>
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
