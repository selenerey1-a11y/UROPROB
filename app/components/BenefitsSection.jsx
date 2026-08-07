const benefits = [
  {
    icon: '⚖️',
    title: 'Equilibrio Total',
    description:
      'Ayuda a mantener la flora bacteriana saludable, evitando molestias e irritaciones comunes.',
  },
  {
    icon: '🛡️',
    title: 'Defensa Urinaria',
    description:
      'Gracias al extracto de arándano concentrado, refuerza tus vías urinarias para que te sientas protegida siempre.',
  },
  {
    icon: '🌿',
    title: 'Bienestar Digestivo e Íntimo',
    description:
      'Al ser un combo de prebióticos y probióticos, no solo cuida tu zona íntima, sino que también favorece una mejor digestión.',
  },
  {
    icon: '✅',
    title: 'Fórmula Limpia y Natural',
    description:
      'Es 100% vegano, libre de gluten y no contiene colorantes artificiales. Cuidas tu cuerpo con lo mejor de la naturaleza.',
  },
  {
    icon: '💊',
    title: 'Fácil de Tomar',
    description:
      'Solo dos cápsulas al día son suficientes para obtener todos sus beneficios.',
  },
];

export function BenefitsSection() {
  return (
    <section className="w-full py-16 px-6 md:px-16">
      <h2
        style={{color: 'var(--color-accent-dark)'}}
        className="text-3xl md:text-4xl font-bold text-center mb-12"
      >
        Beneficios que{' '}
        <span style={{color: 'var(--color-primary)'}}>sentirás</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            style={{backgroundColor: 'var(--color-bg-soft)'}}
            className="rounded-2xl p-6 flex flex-col items-start gap-3"
          >
            <span className="text-4xl">{benefit.icon}</span>
            <h3
              style={{color: 'var(--color-accent-dark)'}}
              className="text-lg font-semibold"
            >
              {benefit.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}