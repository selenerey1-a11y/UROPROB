import scienceVideo from '~/assets/science-diagram.mp4';

export function ScienceSection() {
  return (
    <section className="science-section">
      <div className="science-header">
        <h2 className="science-title">
          La ciencia detrás de URO Probiótico Vaginal
        </h2>
      </div>

      <div className="science-body">
        <div className="science-media">
          <video
            className="science-video"
            src={scienceVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        <div className="science-cards">
          <div className="science-card">
            <span className="science-badge">La biología</span>
            <p className="science-text">
              La vagina tiene un microbioma naturalmente diverso. Cuando
              faltan probióticos Lactobacillus, el pH vaginal puede volverse
              demasiado básico, dejando lugar a bacterias no beneficiosas que
              pueden generar <strong>molestias y olor ocasional</strong>.
            </p>
          </div>

          <div className="science-connector" aria-hidden="true">
            <span className="science-dot" />
            <span className="science-line" />
            <span className="science-dot" />
          </div>

          <div className="science-card">
            <span className="science-badge">Cómo ayuda</span>
            <p className="science-text">
              URO Probiótico Vaginal combina 4 cepas de Lactobacillus con
              prebióticos XOS que las mantienen activas. Juntas ayudan a
              desplazar a las bacterias no beneficiosas, favoreciendo{' '}
              <strong>
                el equilibrio del pH, el confort vaginal y un olor
                saludable.*
              </strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
