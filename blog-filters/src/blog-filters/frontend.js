import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

export default function BlogFiltersFrontend() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    apiFetch({ path: "/wp/v2/categories?per_page=100" }).then(setCategories);
  }, []);

  useEffect(() => {
    const path = active
      ? `/wp/v2/posts?categories=${active}`
      : "/wp/v2/posts";
    apiFetch({ path }).then(setPosts);
  }, [active]);

  return (
    <div className="blog-filters">
      <nav className="nav nav-pills mb-3">
        <button
          className={`nav-link ${active === "" ? "active" : ""}`}
          onClick={() => setActive("")}
        >
          View All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`nav-link ${
              String(active) === String(cat.id) ? "active" : ""
            }`}
            onClick={() => setActive(String(cat.id))}
          >
            {cat.name}
          </button>
        ))}
      </nav>

      <ul>
        {posts.length ? (
          posts.map((post) => (
            <li key={post.id}>
              <a href={post.link}>{post.title.rendered}</a>
            </li>
          ))
        ) : (
          <li>No posts found.</li>
        )}
      </ul>
    </div>
  );
}
