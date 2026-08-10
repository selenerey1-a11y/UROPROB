import {useEffect, useRef, useState} from 'react';

// Real customer testimonial video clips, hosted on Shopify's CDN. `name` is
// shown as a caption under each clip — update if these belong to specific
// customers rather than the placeholder names below.
const VIDEOS = [
  {
    id: 1,
    src: 'https://cdn.shopify.com/videos/c/o/v/2959772405324006a1276a2f87521ebf.mov',
    name: 'Martina',
  },
  {
    id: 2,
    src: 'https://cdn.shopify.com/videos/c/o/v/bf886d13b0f3423f87e4fc1abeed33c1.mov',
    name: 'Camila',
  },
  {
    id: 3,
    src: 'https://cdn.shopify.com/videos/c/o/v/e91c9ce9bcd3461a8e0a291b2b002126.mov',
    name: 'Julieta',
  },
  {
    id: 4,
    src: 'https://cdn.shopify.com/videos/c/o/v/f957a82ae5ba48a9b79138084081fa34.mov',
    name: 'Sofía',
  },
  {
    id: 5,
    src: 'https://cdn.shopify.com/videos/c/o/v/6648f68e99b840a6bf1299b684603ec7.mov',
    name: 'Valentina',
  },
  {
    id: 6,
    src: 'https://cdn.shopify.com/videos/c/o/v/5357a4f816e94179a71790d127961a16.mov',
    name: 'Agustina',
  },
];

// A clone of the last video up front and a clone of the first video at the
// end — the classic infinite-carousel trick. Sliding past either end lands
// on a slide that looks identical to the real one it's replacing, so once
// every video has played we can snap back to the matching real slide
// without animating and no one sees the jump: the loop just keeps going.
const SLIDES = [VIDEOS[VIDEOS.length - 1], ...VIDEOS, VIDEOS[0]];
const FIRST_REAL_INDEX = 1;
const LAST_REAL_INDEX = VIDEOS.length;

const AUTO_ADVANCE_MS = 4000;
const TRANSITION_MS = 350;

export function ProductVideoSection() {
  const [index, setIndex] = useState(FIRST_REAL_INDEX);
  const [instant, setInstant] = useState(false);
  const timerRef = useRef(null);

  function goPrev() {
    setInstant(false);
    setIndex((i) => i - 1);
  }

  function goNext() {
    setInstant(false);
    setIndex((i) => i + 1);
  }

  // Carousel advances on its own; clicking an arrow just restarts the timer
  // so it doesn't immediately jump again right after a manual click.
  useEffect(() => {
    timerRef.current = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, [index]);

  // After sliding onto one of the cloned end slides, wait for that slide
  // the finish animating in, then snap (no transition) to the matching real
  // slide on the other side of the loop.
  useEffect(() => {
    if (index === SLIDES.length - 1) {
      const t = setTimeout(() => {
        setInstant(true);
        setIndex(FIRST_REAL_INDEX);
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
    if (index === 0) {
      const t = setTimeout(() => {
        setInstant(true);
        setIndex(LAST_REAL_INDEX);
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
  }, [index]);

  function handleArrowClick(direction) {
    clearInterval(timerRef.current);
    direction === 'prev' ? goPrev() : goNext();
  }

  return (
    <section
      className="video-carousel-section"
      aria-labelledby="video-carousel-heading"
    >
      <h2 id="video-carousel-heading" className="video-carousel-title">
        + de 1000 mujeres confían en nuestro producto
      </h2>

      <div className="video-carousel">
        <button
          type="button"
          className="video-carousel-arrow video-carousel-arrow-prev"
          onClick={() => handleArrowClick('prev')}
          aria-label="Video anterior"
        >
          <ChevronIcon direction="left" />
        </button>

        <div className="video-carousel-viewport">
          <div
            className={`video-carousel-track${instant ? ' is-jumping' : ''}`}
            style={{
              transform: `translateX(calc(-${index} * (var(--video-card-w) + var(--video-gap))))`,
            }}
          >
            {SLIDES.map((video, i) => (
              <VideoCard key={`${video.id}-${i}`} video={video} />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="video-carousel-arrow video-carousel-arrow-next"
          onClick={() => handleArrowClick('next')}
          aria-label="Siguiente video"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
    </section>
  );
}

function VideoCard({video}) {
  return (
    <div className="video-carousel-card">
      <video
        className="video-carousel-media"
        src={video.src}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="video-carousel-caption">
        <span className="video-carousel-name">-{video.name}</span>
      </div>
    </div>
  );
}

function ChevronIcon({direction}) {
  const d = direction === 'left' ? 'M14 5l-7 7 7 7' : 'M10 5l7 7-7 7';
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
