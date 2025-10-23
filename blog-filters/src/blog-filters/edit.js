import { useState, useEffect } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

export default function Edit() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [posts, setPosts] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    apiFetch({ path: "/wp/v2/categories?per_page=100" }).then(setCategories);
  }, []);

  // Fetch posts based on selected category
  useEffect(() => {
    const path = selectedCategory
      ? `/wp/v2/posts?categories=${selectedCategory}`
      : "/wp/v2/posts";
    apiFetch({ path }).then(setPosts);
  }, [selectedCategory]);

  return (
    <div className="blog-filters-editor">
      <nav className="nav nav-pills flex-column flex-sm-row mb-3">
        <button
          className={`flex-sm-fill text-sm-center nav-link ${
            selectedCategory === "" ? "active" : ""
          }`}
          onClick={() => setSelectedCategory("")}
        >
          View All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`flex-sm-fill text-sm-center nav-link ${
              String(selectedCategory) === String(cat.id) ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(String(cat.id))}
          >
            {cat.name}
          </button>
        ))}
      </nav>

      <ul>
        {posts.length ? (
          posts.map((post) => (
            <li key={post.id}>
              <a href={post.link} target="_blank" rel="noreferrer">
                {post.title.rendered}
              </a>
            </li>
          ))
        ) : (
          <li>No posts found.</li>
        )}
      </ul>
    </div>
  );
}
