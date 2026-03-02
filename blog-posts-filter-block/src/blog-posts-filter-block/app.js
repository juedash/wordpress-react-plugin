import { useEffect, useMemo, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

import PostGrid from "./components/PostGrid";
import PostsPagination from "./components/PostsPagination";
import PostsGridSkeleton from "./components/PostsGridSkeleton";
import PostsFilters from "./components/PostsFilters";

const getPolylangLang = () => {
	const htmlLang = document?.documentElement?.lang || "";
	const short = htmlLang.split("-")[0].toLowerCase();
	return short || "";
};

const buildPostsPath = ({ perPage, page, cat, catIds = [] }) => {
	const params = new URLSearchParams();
	params.set("per_page", String(perPage));
	params.set("page", String(page));
	params.set("_embed", "1");
	params.set("orderby", "date");
	params.set("order", "desc");

	if (cat && Number(cat) > 0) {
		params.set("categories", String(cat));
	} else if (Array.isArray(catIds) && catIds.length) {
		params.set("categories", catIds.join(","));
	}

	return `/wp/v2/posts?${params.toString()}`;
};
export default function App({ perPage = 6, columns = 3 }) {
	const [cats, setCats] = useState([]);
	const [activeCat, setActiveCat] = useState(0);
	const [loadingCats, setLoadingCats] = useState(true);

	const [page, setPage] = useState(1);
	const [posts, setPosts] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loadingPosts, setLoadingPosts] = useState(true);

	const [error, setError] = useState("");

	// Fetch categories
	useEffect(() => {
		let cancelled = false;

		const lang = getPolylangLang();
		setLoadingCats(true);

		const params = new URLSearchParams();
		params.set("per_page", "100");
		params.set("hide_empty", "1");
		params.set("orderby", "name");
		params.set("order", "asc");
		if (lang) params.set("lang", lang); // Polylang REST must support this

		apiFetch({ path: `/wp/v2/categories?${params.toString()}` })
			.then((data) => {
				if (cancelled) return;

				const arr = Array.isArray(data) ? data : [];
				// extra safety: only categories that actually have posts
				const nonEmpty = arr.filter((c) => Number(c?.count) > 0);

				setCats(nonEmpty);
			})
			.catch(() => {
				if (!cancelled) setCats([]);
			})
			.finally(() => {
				if (!cancelled) setLoadingCats(false);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	const currentLangCatIds = useMemo(
		() => cats.map((c) => c.id).filter(Boolean),
		[cats],
	);

	// Fetch posts
	useEffect(() => {
		let cancelled = false;
		setLoadingPosts(true);
		setError("");

		apiFetch({
			path: buildPostsPath({
				perPage,
				page,
				cat: activeCat,
				catIds: activeCat === 0 ? currentLangCatIds : [],
			}),
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
				if (!cancelled)
					setError(
						e?.message ||
							(window.i18n?.loadPostsError ?? "Error loading posts"),
					);
			})
			.finally(() => {
				if (!cancelled) setLoadingPosts(false);
			});

		return () => {
			cancelled = true;
		};
	}, [perPage, page, activeCat, currentLangCatIds]);

	const onSelectCat = (catId) => {
		setActiveCat(catId);
		setPage(1);
	};

	// 🔑 SINGLE SOURCE OF TRUTH FOR LOADING UI
	const isLoading = loadingCats || loadingPosts;

	return (
		<div className="hide-wp-block-classes alignwide mb-3">
			{/* Filters only show once categories are ready */}
			{!loadingCats && cats.length > 0 && (
				<div className="mb-3">
					<PostsFilters
						cats={cats}
						activeCat={activeCat}
						onSelect={onSelectCat}
					/>
				</div>
			)}

			{error && <div className="bpffb-error alert alert-danger">{error}</div>}

			{/* ONE loader. ALWAYS the skeleton. */}
			{isLoading ? (
				<PostsGridSkeleton />
			) : (
				<>
					<PostGrid posts={posts}/>
					<PostsPagination
						page={page}
						totalPages={totalPages}
						onPrev={() => setPage((p) => Math.max(1, p - 1))}
						onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
						onGoTo={(n) => setPage(n)}
					/>
				</>
			)}
		</div>
	);
}
