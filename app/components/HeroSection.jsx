export function HeroSection() {
  return (
    <section
      style={{backgroundColor: 'var(--color-bg-soft)'}}
      className="w-full py-16 px-6 md:px-16 flex flex-col md:flex-row items-center gap-10"
    >
      <div className="flex-1 text-center md:text-left">
        <h1
          style={{color: 'var(--color-accent-dark)'}}
          className="text-4xl md:text-5xl font-bold leading-tight mb-4"
        >
          Cuida tu bienestar,{' '}
          <span style={{color: 'var(--color-primary)'}}>todos los días</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto md:mx-0">
          Un suplemento diario pensado para apoyar tu equilibrio natural,
          con ingredientes de calidad respaldados por la ciencia.
        </p>
        
          <a href="#producto"
          style={{backgroundColor: 'var(--color-primary)'}}
          className="inline-block text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition"
        >
          Comprar ahora
        </a>
      </div>

      <div className="flex-1 flex justify-center">
        <img
          src="https://placehold.co/500x500/FDF3F0/E85D75?text=Tu+Producto"
          alt="Producto"
          className="rounded-3xl max-w-full w-[400px]"
        />
      </div>
    </section>
  );
}