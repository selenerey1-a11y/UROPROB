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

// The list is laid out three times in a row and we always sit in the middle
// copy. A single clone per end isn't enough: the viewport shows several cards
// at once, so landing on the last slide would leave the remaining slots empty.
// With a whole copy either side there is always a full screen of videos ahead
// and behind, and because the copies are identical we can jump a full LOOP
// back to the middle without animating and the loop looks seamless.
const LOOP = VIDEOS.length;
const SLIDES = [...VIDEOS, ...VIDEOS, ...VIDEOS];

// Widest the viewport ever gets (1200px minus arrows) divided by a card plus
// its gap — the number of slides that must always exist ahead of the index.
const VISIBLE_SLOTS = 6;

const AUTO_ADVANCE_MS = 4000;
const TRANSITION_MS = 350;

export function ProductVideoSection() {
  const [index, setIndex] = useState(LOOP);
  const [instant, setInstant] = useState(false);
  const timerRef = useRef(null);
  const trackRef = useRef(null);

  // Both guards ignore input while a snap is still pending, keeping the index
  // inside [LOOP - 1, 2 * LOOP] so there are never fewer than VISIBLE_SLOTS
  // slides left to render.
  function goPrev() {
    setInstant(false);
    setIndex((i) => (i < LOOP ? i : i - 1));
  }

  function goNext() {
    setInstant(false);
    setIndex((i) => (i >= 2 * LOOP ? i : i + 1));
  }

  // Carousel advances on its own; clicking an arrow just restarts the timer
  // so it doesn't immediately jump again right after a manual click.
  useEffect(() => {
    timerRef.current = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, [index]);

  // Once the index leaves the middle copy, let the slide finish animating and
  // then jump a whole LOOP back into it with no transition. The slide landed
  // on and every slide around it are the same clips, so nothing visibly moves.
  useEffect(() => {
    if (index >= 2 * LOOP) {
      const t = setTimeout(() => {
        setInstant(true);
        setIndex((i) => i - LOOP);
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
    if (index < LOOP) {
      const t = setTimeout(() => {
        setInstant(true);
        setIndex((i) => i + LOOP);
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
  }, [index]);

  // Tripling the slides would otherwise triple the number of clips decoding at
  // once, so only the ones in (or just off) the viewport actually play.
  useEffect(() => {
    const cards = trackRef.current?.children ?? [];
    for (let i = 0; i < cards.length; i++) {
      const media = cards[i].querySelector('video');
      if (!media) continue;
      if (i >= index - 1 && i <= index + VISIBLE_SLOTS) {
        // Autoplay can still be refused (low power mode, for one); a paused
        // card is a far better outcome than an unhandled rejection.
        media.play().catch(() => {});
      } else if (!media.paused) {
        media.pause();
      }
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
            ref={trackRef}
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
      {/* No `autoPlay`: the carousel starts and stops each clip itself so only
          the visible ones are decoding. `muted` is what makes that allowed. */}
      <video
        className="video-carousel-media"
        src={video.src}
        loop
        muted
        playsInline
        preload="metadata"
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
