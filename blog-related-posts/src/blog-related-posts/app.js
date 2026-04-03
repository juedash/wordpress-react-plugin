import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const getLang = () => window.relatedPostsData?.currentLang || "";

// fallback language detection from URL (for Polylang free)
const getPostLanguageFromLink = (post) => {
	try {
		const url = new URL(post?.link || "", window.location.origin);
		const segments = url.pathname.split("/").filter(Boolean);
		return segments[0] || "";
	} catch {
		return "";
	}
};

const filterPostsByLang = (posts, currentLang) => {
	if (!currentLang) return posts;

	return posts.filter((p) => {
		const lang = getPostLanguageFromLink(p);
		return lang === currentLang;
	});
};

const buildPath = ({ postId, catIds, perPage }) => {
	const params = new URLSearchParams();

	params.set("per_page", "20"); // fetch more → filter client-side
	params.set("_embed", "1");
	params.set("orderby", "date");
	params.set("order", "desc");
	params.set("exclude", String(postId));

	if (Array.isArray(catIds) && catIds.length) {
		params.set("categories", catIds.join(","));
	}

	return `/wp/v2/posts?${params.toString()}`;
};

export default function App({ postId, catIds = [], perPage = 6, title }) {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let canceled = false;

		setLoading(true);
		setError("");

		const currentLang = getLang();

		apiFetch({
			path: buildPath({ postId, catIds, perPage }),
		})
			.then((data) => {
				if (canceled) return;

				const allPosts = Array.isArray(data) ? data : [];

				// filter language manually
				const filtered = filterPostsByLang(allPosts, currentLang);

				setPosts(filtered.slice(0, perPage));
			})
			.catch((err) => {
				if (!canceled) {
					setError(
						err?.message ||
							window.relatedPostsI18n?.loadPostsError ||
							"Error loading posts"
					);
				}
			})
			.finally(() => {
				if (!canceled) setLoading(false);
			});

		return () => {
			canceled = true;
		};
	}, [postId, catIds.join(","), perPage]);

	if (loading) {
		return <p className="mt-4">Loading...</p>;
	}

	if (error || !posts.length) {
		return null;
	}

	return (
<section className="mt-5">
	<h2 className="h3 mb-4">{title}</h2>

	<div
		className="d-flex gap-4 overflow-auto pb-2"
		style={{
			scrollSnapType: "x mandatory",
		}}
	>
		{posts.map((p) => {
			const media = p?._embedded?.["wp:featuredmedia"]?.[0];
			const img = media?.source_url || "";
			const alt = media?.alt_text || "";

			return (
				<div
					key={p.id}
					className="flex-shrink-0"
					style={{
						width: "280px",
						scrollSnapAlign: "start",
					}}
				>
					{img && (
						<a href={p.link} className="d-block mb-3">
							<img
								src={img}
								alt={alt}
								className="w-100 rounded"
								style={{
									aspectRatio: "16 / 9",
									objectFit: "cover",
								}}
								loading="lazy"
							/>
						</a>
					)}

					<a href={p.link} className="text-decoration-none">
						<h6
							className="text-body fw-semibold mb-2"
							dangerouslySetInnerHTML={{
								__html: p.title.rendered,
							}}
						/>
					</a>

					<a
						className="icon-link"
						href={p.link}
						style={{ width: "max-content" }}
					>
						{window.relatedPostsI18n?.readMore ?? "Read more"}
						<svg className="icon">
							<use href="/wp-content/themes/kp-theme/assets/fonts/icon.svg#chevron-right" />
						</svg>
					</a>
				</div>
			);
		})}
	</div>
</section>
	);
}
