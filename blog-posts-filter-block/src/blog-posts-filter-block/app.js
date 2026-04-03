import { useEffect, useMemo, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

import PostGrid from "./components/PostGrid";
import PostsPagination from "./components/PostsPagination";
import PostsGridSkeleton from "./components/PostsGridSkeleton";
import PostsFilters from "./components/PostsFilters";

const getLang = () => window.bpffbData?.currentLang || "";

const normalizeLang = (value) =>
	String(value || "")
		.trim()
		.toLowerCase()
		.split("-")[0];

const getPostLanguageFromLink = (post) => {
	try {
		const url = new URL(post?.link || "", window.location.origin);
		const segments = url.pathname.split("/").filter(Boolean);
		const firstSegment = normalizeLang(segments[0] || "");

		const knownLanguages = ["de", "en"];

		return knownLanguages.includes(firstSegment) ? firstSegment : "";
	} catch {
		return "";
	}
};

const getPostLanguage = (post) => {
	if (post?.lang) return normalizeLang(post.lang);
	if (post?.language) return normalizeLang(post.language);
	return getPostLanguageFromLink(post);
};

const filterPostsByCurrentLanguage = (posts, currentLang) => {
	const normalizedCurrentLang = normalizeLang(currentLang);

	if (!Array.isArray(posts)) return [];
	if (!normalizedCurrentLang) return posts;

	return posts.filter((post) => {
		const postLang = getPostLanguage(post);
		return postLang === normalizedCurrentLang;
	});
};

const buildPostsPath = ({
	perPage,
	page,
	cat,
	tag,
	author,
	catIds = [],
}) => {
	const params = new URLSearchParams();

	params.set("per_page", String(perPage));
	params.set("page", String(page));
	params.set("_embed", "1");
	params.set("orderby", "date");
	params.set("order", "desc");

	const lang = getLang();
	if (lang) {
		params.set("lang", lang);
	}

	if (author && Number(author) > 0) {
		params.set("author_id", String(author));
		return `/bpffb/v1/author-posts?${params.toString()}`;
	}

	if (tag && Number(tag) > 0) {
		params.set("tags", String(tag));
	} else if (cat && Number(cat) > 0) {
		params.set("categories", String(cat));
	} else if (Array.isArray(catIds) && catIds.length) {
		params.set("categories", catIds.join(","));
	}

	return `/wp/v2/posts?${params.toString()}`;
};

function App({
	perPage = 6,
	columns = 3,
	archiveType = "",
	archiveId = 0,
}) {
	const isCategoryArchive = archiveType === "category";
	const isTagArchive = archiveType === "tag";
	const isAuthorArchive = archiveType === "author";

	const defaultCat = isCategoryArchive ? Number(archiveId) || 0 : 0;
	const defaultTag = isTagArchive ? Number(archiveId) || 0 : 0;
	const defaultAuthor = isAuthorArchive ? Number(archiveId) || 0 : 0;

	const showFilters = !isCategoryArchive && !isTagArchive && !isAuthorArchive;

	const [cats, setCats] = useState([]);
	const [activeCat, setActiveCat] = useState(defaultCat);
	const [activeTag, setActiveTag] = useState(defaultTag);
	const [page, setPage] = useState(1);

	const [posts, setPosts] = useState([]);
	const [totalPages, setTotalPages] = useState(1);

	const [loadingCats, setLoadingCats] = useState(showFilters);
	const [loadingPosts, setLoadingPosts] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		setActiveCat(defaultCat);
		setActiveTag(defaultTag);
		setPage(1);
	}, [defaultCat, defaultTag, defaultAuthor]);

	useEffect(() => {
		if (!showFilters) {
			setCats([]);
			setLoadingCats(false);
			return;
		}

		let canceled = false;
		const lang = getLang();

		setLoadingCats(true);

		const params = new URLSearchParams();
		params.set("per_page", "100");
		params.set("hide_empty", "1");
		params.set("orderby", "name");
		params.set("order", "asc");

		if (lang) {
			params.set("lang", lang);
		}

		apiFetch({ path: `/wp/v2/categories?${params.toString()}` })
			.then((res) => {
				if (canceled) return;

				const filtered = (Array.isArray(res) ? res : []).filter(
					(c) => Number(c?.count) > 0,
				);

				setCats(filtered);
			})
			.catch(() => {
				if (!canceled) setCats([]);
			})
			.finally(() => {
				if (!canceled) setLoadingCats(false);
			});

		return () => {
			canceled = true;
		};
	}, [showFilters]);

	const currentLangCatIds = useMemo(
		() => cats.map((c) => c.id).filter(Boolean),
		[cats],
	);

	useEffect(() => {
		let canceled = false;

		setLoadingPosts(true);
		setError("");

		// AUTHOR: fetch all + filter client-side
		if (defaultAuthor) {
			const currentLang = getLang();

			const fetchAllAuthorPosts = async () => {
				const params = new URLSearchParams();
				params.set("author_id", String(defaultAuthor));
				params.set("per_page", "100");
				params.set("page", "1");
				params.set("_embed", "1");

				if (currentLang) {
					params.set("lang", currentLang);
				}

				const url = `${window.location.origin}/wp-json/bpffb/v1/author-posts?${params.toString()}`;

				const res = await fetch(url);
				if (!res.ok) throw new Error(`HTTP ${res.status}`);

				const data = await res.json();
				return Array.isArray(data) ? data : [];
			};

			(async () => {
				try {
					const allPosts = await fetchAllAuthorPosts();

					const filtered = filterPostsByCurrentLanguage(
						allPosts,
						currentLang,
					);

					const total = Math.max(
						1,
						Math.ceil(filtered.length / perPage),
					);

					const start = (page - 1) * perPage;
					const paginated = filtered.slice(start, start + perPage);

					if (!canceled) {
						setPosts(paginated);
						setTotalPages(total);
					}
				} catch (err) {
					if (!canceled) {
						setError(
							err?.message ||
								(window.i18n?.loadPostsError ??
									"Error loading posts"),
						);
					}
				} finally {
					if (!canceled) setLoadingPosts(false);
				}
			})();

			return () => {
				canceled = true;
			};
		}

		// NORMAL (category/tag/default)
		apiFetch({
			path: buildPostsPath({
				perPage,
				page,
				cat: activeCat,
				tag: activeTag,
				author: defaultAuthor,
				catIds:
					activeCat === 0 && activeTag === 0 && !defaultAuthor
						? currentLangCatIds
						: [],
			}),
			parse: false,
		})
			.then(async (res) => {
				const data = await res.json();
				const totalPgs = Number(
					res.headers.get("X-WP-TotalPages") || "1",
				);

				if (!canceled) {
					setPosts(Array.isArray(data) ? data : []);
					setTotalPages(totalPgs || 1);
				}
			})
			.catch((err) => {
				if (!canceled) {
					setError(
						err?.message ||
							(window.i18n?.loadPostsError ??
								"Error loading posts"),
					);
					setPosts([]);
					setTotalPages(1);
				}
			})
			.finally(() => {
				if (!canceled) setLoadingPosts(false);
			});

		return () => {
			canceled = true;
		};
	}, [perPage, page, activeCat, activeTag, defaultAuthor, currentLangCatIds]);

	const onSelectCat = (id) => {
		setActiveCat(Number(id) || 0);
		setActiveTag(0);
		setPage(1);
	};

	const isLoading = loadingPosts || (showFilters && loadingCats);

	return (
		<div className="hide-wp-block-classes alignwide mb-3">
			{error && <div className="bpffb-error alert alert-danger">{error}</div>}

			{isLoading ? (
				<PostsGridSkeleton />
			) : (
				<>
					{showFilters && (
						<div className="mb-5">
							<PostsFilters
								loading={loadingCats}
								cats={cats}
								activeCat={activeCat}
								onSelect={onSelectCat}
							/>
						</div>
					)}

					<PostGrid posts={posts} />

					<PostsPagination
						page={page}
						totalPages={totalPages}
						onPrev={() => setPage((p) => Math.max(1, p - 1))}
						onNext={() =>
							setPage((p) => Math.min(totalPages, p + 1))
						}
						onGoTo={(n) => setPage(n)}
					/>
				</>
			)}
		</div>
	);
}

export default App;
