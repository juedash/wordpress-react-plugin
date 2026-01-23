import { useEffect, useMemo, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { Spinner } from "@wordpress/components";
import { decodeEntities } from "@wordpress/html-entities";

const getCurrentLang = () => {
	const raw = document?.documentElement?.lang || "en";
	return raw.split("-")[0]; 
};

const lang = getCurrentLang();

const buildPostsPath = ({ perPage, page, cat }) => {
	const params = new URLSearchParams();
	params.set("per_page", String(perPage));
	params.set("page", String(page));
	params.set("_embed", "1");
	params.set("orderby", "date");
	params.set("order", "desc");

	if (cat && Number(cat) > 0) params.set("categories", String(cat));

	if (lang) params.set("lang", lang);

	return `/wp/v2/posts?${params.toString()}`;
};

const getFeaturedImage = (post) => {
	const media = post?._embedded?.["wp:featuredmedia"]?.[0];
	return {
		url: media?.source_url || "",
		alt: media?.alt_text || "",
	};
};

const getCategories = (post) => {
	const terms = post?._embedded?.["wp:term"]?.[0] || [];
	return terms.map((t) => ({ id: t.id, name: t.name, link: t.link }));
};

const estimateReadTime = (html = "", wpm = 200) => {
	const text = html
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	const words = text ? text.split(" ").length : 0;
	const minutes = Math.max(1, Math.round(words / wpm));

	return `${minutes} min`;
};

export default function PostsGrid({ perPage = 6, columns = 3 }) {
	// filters
	const [cats, setCats] = useState([]);
	const [activeCat, setActiveCat] = useState(0);
	const [loadingCats, setLoadingCats] = useState(true);

	// posts
	const [page, setPage] = useState(1);
	const [posts, setPosts] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loadingPosts, setLoadingPosts] = useState(true);

	const [error, setError] = useState("");

	// load categories (only categories that have posts)
	useEffect(() => {
		let cancelled = false;
		setLoadingCats(true);

		apiFetch({
			path: `/wp/v2/categories?per_page=100&hide_empty=1&lang=${lang}`,
		})
			.then((data) => {
				if (cancelled) return;
				const list = Array.isArray(data) ? data : [];
				setCats(list.filter((c) => Number(c?.count || 0) > 0));
			})
			.catch((e) => {
				if (!cancelled) setError(e?.message || "Failed to load categories");
			})
			.finally(() => {
				if (!cancelled) setLoadingCats(false);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	// load posts
	useEffect(() => {
		let cancelled = false;
		setLoadingPosts(true);
		setError("");

		apiFetch({
			path: buildPostsPath({ perPage, page, cat: activeCat }),
			parse: false,
		})
			.then(async (res) => {
				const json = await res.json();
				const tp = Number(res.headers.get("X-WP-TotalPages") || "1");
				if (cancelled) return;

				setPosts(Array.isArray(json) ? json : []);
				setTotalPages(tp || 1);
			})
			.catch((e) => {
				if (!cancelled) setError(e?.message || "Failed to load posts");
			})
			.finally(() => {
				if (!cancelled) setLoadingPosts(false);
			});

		return () => {
			cancelled = true;
		};
	}, [perPage, page, activeCat]);

	const gridStyle = useMemo(
		() => ({
			display: "grid",
			gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
			gap: "1.5rem",
		}),
		[columns],
	);

	const pageNumbers = useMemo(
		() => Array.from({ length: totalPages }, (_, i) => i + 1),
		[totalPages],
	);

	const onSelectCat = (catId) => {
		setActiveCat(catId);
		setPage(1);
	};

	return (
		<div className="hide-wp-block-classes alignwide mb-3">
			{/* Filters (only render if there are categories) */}
			{loadingCats ? (
				<Spinner />
			) : cats.length > 0 ? (
				<ul className="nav nav-pills blog-filters mb-3">
					<li className="nav-item">
						<a
							className={`nav-link ${activeCat === 0 ? "active" : ""}`}
							onClick={() => onSelectCat(0)}
						>
							View all
						</a>
					</li>

					{cats.map((c) => (
						<li className="nav-item" key={c.id}>
							<a
								className={`nav-link ${activeCat === c.id ? "active" : ""}`}
								onClick={() => onSelectCat(c.id)}
							>
								{decodeEntities(c.name)}
							</a>
						</li>
					))}
				</ul>
			) : null}

			{error && <div className="bpffb-error alert alert-danger">{error}</div>}

			{loadingPosts ? (
				<Spinner />
			) : (
				<>
					<div style={gridStyle}>
						{posts.map((p) => {
							const img = getFeaturedImage(p);
							const postCats = getCategories(p);
							const readTime = estimateReadTime(p?.content?.rendered || "");

							return (
								<article
									key={p.id}
									className="h-100 d-flex flex-column position-relative border-0"
								>
									{img.url && (
										<img
											className="mb-3 rounded"
											src={img.url}
											alt={img.alt}
											style={{
												width: "100%",
												aspectRatio: "4/3",
												objectFit: "cover",
											}}
											loading="lazy"
										/>
									)}

									<div className="d-flex gap-2 align-items-center mb-2 flex-wrap">
										{postCats.map((t) => (
											<a
												key={t.id}
												href={t.link}
												className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis text-decoration-none border border-primary"
											>
												{decodeEntities(t.name)}
											</a>
										))}

										<span className="small text-muted">{readTime} read</span>
									</div>

									<h3
										className="h5 mb-2"
										dangerouslySetInnerHTML={{ __html: p.title.rendered }}
									/>

									<div className="flex-grow-1 d-flex flex-column justify-content-between">
										<div
											className="mb-0 text-muted"
											dangerouslySetInnerHTML={{ __html: p.excerpt.rendered }}
										/>

										<a className="stretched-link icon-link" href={p.link}>
											Read more
											<svg class="icon">
												<use href="/wp-content/themes/kp-theme/assets/fonts/icon.svg#chevron-right" />
											</svg>
										</a>
									</div>
								</article>
							);
						})}
					</div>

					{/* Pagination (only render when more than one page) */}
					{totalPages > 1 && (
						<div className="pagination justify-content-center mt-4 d-flex gap-2 align-items-center">
							{page > 1 && (
								<a
									className="prev-next icon-link"
									onClick={() => setPage((x) => Math.max(1, x - 1))}
								>
									Previous
									<svg class="icon">
										<use href="/wp-content/themes/kp-theme/assets/fonts/icon.svg#chevron-left" />
									</svg>
								</a>
							)}

							<div className="d-flex gap-1">
								{pageNumbers.map((n) => (
									<a
										key={n}
										className={`page-numbers ${n === page ? "current" : ""}`}
										onClick={() => setPage(n)}
										aria-current={n === page ? "page" : undefined}
									>
										{n}
									</a>
								))}
							</div>
							{page < totalPages && (
								<a
									className="prev-next icon-link"
									onClick={() => setPage((x) => Math.min(totalPages, x + 1))}
								>
									Next
									<svg class="icon">
										<use href="/wp-content/themes/kp-theme/assets/fonts/icon.svg#chevron-right" />
									</svg>
								</a>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}
