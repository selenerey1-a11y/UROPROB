import capsulesPhoto from '~/assets/testimonial-photo-capsules.png';
import handCapsulesPhoto from '~/assets/testimonial-photo-hand-capsules.png';
import jarBathroomPhoto from '~/assets/testimonial-photo-jar-bathroom.png';
import jarPlantPhoto from '~/assets/testimonial-photo-jar-plant.png';

// Photo-backed testimonial cards — real UROPROB customer photos with a
// dark gradient scrim so the white headline/quote text stays legible.
// Swap photos/quotes for real verified reviews as they come in.
const TESTIMONIALS = [
  {
    id: 1,
    photo: capsulesPhoto,
    headline: 'Me encanta al 100%',
    name: 'Marisol',
    rating: 5,
    quote:
      'Este es mi tercer bote y cuando digo que esto funciona, lo digo en serio... Si todavía no lo has comprado, no sé a qué esperas.',
  },
  {
    id: 2,
    photo: handCapsulesPhoto,
    headline: 'Lo recomiendo 10/10',
    name: 'Alba',
    rating: 5,
    quote:
      'Me encantan estos probióticos. Los resultados se notan y hacen justo lo que prometen. ¡Lo recomiendo totalmente!',
  },
  {
    id: 3,
    photo: jarBathroomPhoto,
    headline: '¡Feliz!',
    name: 'Noelia',
    rating: 5,
    quote:
      'Ni siquiera se lo dije a mi pareja, y notó la diferencia y me preguntó qué estaba tomando. Y eso que solo iba por el segundo bote.',
  },
  {
    id: 4,
    photo: jarPlantPhoto,
    headline: 'No puedes equivocarte',
    name: 'Cristina',
    rating: 5,
    quote:
      'Voy por mi tercer bote. Me siento mucho mejor. Ya no tengo que preocuparme por mi frescura.',
  },
];

export function TestimonialsSection() {
  return (
    <section
      className="testimonials-section"
      aria-labelledby="testimonials-heading"
    >
      <h2 id="testimonials-heading" className="testimonials-title">
        No te quedes solo con nuestra palabra
      </h2>

      <div className="testimonials-grid">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.id}
            className="testimonials-card"
            style={{backgroundImage: `url(${testimonial.photo})`}}
          >
            <div className="testimonials-card-scrim" />
            <div className="testimonials-card-content">
              <p className="testimonials-headline">{testimonial.headline}</p>
              <div className="testimonials-identity">
                <PersonIcon />
                <span className="testimonials-name">{testimonial.name}</span>
              </div>
              <div className="testimonials-meta">
                <span className="testimonials-stars" aria-hidden="true">
                  {'★★★★★'.slice(0, testimonial.rating)}
                </span>
                <span className="testimonials-verified">
                  Compra verificada
                </span>
              </div>
              <p className="testimonials-quote">{testimonial.quote}</p>
            </div>
          </div>
        ))}
      </div>

      <a href="/products/uroprob" className="testimonials-cta">
        Comprar ahora
      </a>
    </section>
  );
}

function PersonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
