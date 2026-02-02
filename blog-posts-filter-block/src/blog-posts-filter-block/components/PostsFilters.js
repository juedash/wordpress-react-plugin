import { decodeEntities } from "@wordpress/html-entities";

export default function PostsFilters({
  loading,
  cats,
  activeCat,
  onSelect,
  skeletonCount = 6,
}) {
  if (loading) {
    return (
      <ul className="nav nav-pills blog-filters mb-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <li className="nav-item" key={i}>
            <span className="nav-link filter-tab disabled placeholder-glow">
              <span className="placeholder col-8">&nbsp;</span>
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (!cats || cats.length === 0) return null;

  return (
    <ul className="nav nav-pills blog-filters mb-3">
      <li className="nav-item">
        <button
          className={`nav-link filter-tab ${activeCat === 0 ? "active" : ""}`}
          onClick={() => onSelect(0)}
          type="button"
        >
          View all
        </button>
      </li>

      {cats.map((c) => (
        <li className="nav-item" key={c.id}>
          <button
            className={`nav-link filter-tab ${activeCat === c.id ? "active" : ""}`}
            onClick={() => onSelect(c.id)}
            type="button"
          >
            {decodeEntities(c.name)}
          </button>
        </li>
      ))}
    </ul>
  );
}
