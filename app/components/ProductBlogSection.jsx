import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

/**
 * "El blog diario" — a few recent articles, matching the reference page's
 * content-marketing footer section. Renders nothing if the shop has no
 * blog/articles yet.
 * @param {{articles: Array<{id: string; title: string; handle: string; image: {url: string; altText: string | null} | null; blog: {handle: string}}>}}
 */
export function ProductBlogSection({articles}) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="product-blog-section" aria-labelledby="product-blog-heading">
      <h2 id="product-blog-heading" className="product-blog-title">
        El blog diario
      </h2>
      <div className="product-blog-grid">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/blogs/${article.blog.handle}/${article.handle}`}
            className="product-blog-card"
            prefetch="intent"
          >
            {article.image ? (
              <div className="product-blog-card-image">
                <Image
                  alt={article.image.altText || article.title}
                  aspectRatio="3/2"
                  data={article.image}
                  sizes="(min-width: 45em) 33vw, 100vw"
                />
              </div>
            ) : null}
            <h3 className="product-blog-card-title">{article.title}</h3>
          </Link>
        ))}
      </div>
      <Link to="/blogs/news" className="product-blog-more">
        Explorar más
      </Link>
    </section>
  );
}
