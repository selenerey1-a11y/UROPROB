const CONTACT_EMAIL = 'uroprob@gmail.com';

/**
 * Ruta estática: tiene prioridad sobre `pages.$handle`, así que sustituye a la
 * página "contact" de Shopify (que está vacía) sin tocar el admin. El menú de
 * la tienda ya apunta aquí.
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Contacto | UROprob'},
    {
      name: 'description',
      content: `Escríbenos a ${CONTACT_EMAIL} y te respondemos en 24-48 h laborables.`,
    },
  ];
};

export default function Contacto() {
  return (
    <div className="contact-page">
      <header className="contact-hero">
        <p className="contact-eyebrow">Estamos aquí</p>
        <h1 className="contact-title">Contacto</h1>
        <p className="contact-intro">
          ¿Tienes una duda sobre tu pedido, tu suscripción o el producto?
          Escríbenos y te responde una persona del equipo.
        </p>
      </header>

      <section className="contact-card" aria-labelledby="contact-email-heading">
        <h2 id="contact-email-heading" className="contact-card-label">
          Correo
        </h2>
        <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        <p className="contact-card-note">
          Respondemos de lunes a viernes, normalmente en 24-48 h laborables.
        </p>
      </section>

      <p className="contact-footnote">
        Nuestros productos son suplementos alimenticios y no sustituyen el
        consejo médico. Si tienes un problema de salud, consulta con un
        profesional sanitario.
      </p>
    </div>
  );
}

/** @typedef {import('./+types/pages.contact').Route} Route */
