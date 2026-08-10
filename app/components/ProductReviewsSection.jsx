import {useMemo, useState} from 'react';
import {REVIEWS, getReviewStats} from '~/lib/placeholderReviews';

const PAGE_SIZE = 8;

const DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function formatDate(isoDate) {
  return DATE_FORMATTER.format(new Date(`${isoDate}T12:00:00Z`));
}

/**
 * Full reviews section: average rating + star breakdown bars, a search box,
 * and the review list itself. All numbers here (average, total, per-star
 * counts) are computed live from the placeholder review data — see
 * ~/lib/placeholderReviews for why these are placeholders and what to swap
 * them for.
 */
export function ProductReviewsSection() {
  const stats = useMemo(() => getReviewStats(REVIEWS), []);
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return REVIEWS;
    return REVIEWS.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.body.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q),
    );
  }, [query]);

  const isSearching = query.trim().length > 0;
  const visibleReviews = isSearching
    ? filtered
    : filtered.slice(0, visibleCount);

  return (
    <section
      className="reviews-section"
      id="product-reviews"
      aria-labelledby="product-reviews-heading"
    >
      <h2 id="product-reviews-heading" className="reviews-section-title">
        Reseñas de clientas
      </h2>

      <div className="reviews-summary">
        <div className="reviews-summary-score">
          <span className="reviews-summary-average">
            {stats.average.toFixed(1)}
          </span>
          <Stars rating={Math.round(stats.average)} />
        </div>
        <p className="reviews-summary-count">
          Basado en {stats.total} reseñas
        </p>

        <div className="reviews-bars">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.counts[star] || 0;
            const pct = stats.total ? (count / stats.total) * 100 : 0;
            return (
              <div className="reviews-bar-row" key={star}>
                <span className="reviews-bar-label">
                  {star} <StarIcon />
                </span>
                <span className="reviews-bar-track">
                  <span
                    className="reviews-bar-fill"
                    style={{width: `${pct}%`}}
                  />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="reviews-search">
        <input
          type="search"
          className="reviews-search-input"
          placeholder="Buscar en las reseñas"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar en las reseñas"
        />
        <button
          type="button"
          className="reviews-search-btn"
          aria-label="Buscar"
          tabIndex={-1}
        >
          <SearchIcon />
        </button>
      </div>

      <ul className="reviews-list">
        {visibleReviews.map((review) => (
          <li className="reviews-list-item" key={review.id}>
            <p className="reviews-item-name">{review.name}</p>
            <div className="reviews-item-meta">
              <Stars rating={review.rating} />
              <span className="reviews-item-date">
                {formatDate(review.date)}
              </span>
            </div>
            <span className="reviews-item-verified">
              <CheckBadgeIcon />
              Compra verificada
            </span>
            <h3 className="reviews-item-title">{review.title}</h3>
            <p className="reviews-item-body">{review.body}</p>
          </li>
        ))}
      </ul>

      {!isSearching && visibleCount < filtered.length ? (
        <button
          type="button"
          className="reviews-load-more"
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
        >
          Cargar más reseñas
        </button>
      ) : null}

      {isSearching && filtered.length === 0 ? (
        <p className="reviews-empty">
          No encontramos reseñas que coincidan con &ldquo;{query}&rdquo;.
        </p>
      ) : null}
    </section>
  );
}

function Stars({rating}) {
  return (
    <span className="reviews-stars" aria-hidden="true">
      {'★★★★★'.slice(0, rating)}
      {'★★★★★'.slice(rating).replace(/★/g, '☆')}
    </span>
  );
}

function StarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m9 12 2 2 4-4M12 3l2.2 1.3 2.6-.2 1 2.4 2.2 1.4-.5 2.6.5 2.6-2.2 1.4-1 2.4-2.6-.2L12 21l-2.2-1.3-2.6.2-1-2.4-2.2-1.4.5-2.6-.5-2.6 2.2-1.4 1-2.4 2.6.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
