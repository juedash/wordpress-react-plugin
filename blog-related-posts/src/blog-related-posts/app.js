import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const getLang = () => window.bpffbData?.currentLang || "";

const buildPath = ({ postId, catIds, perPage }) => {
	const params = new URLSearchParams();

	params.set("per_page", String(perPage));
	params.set("_embed", "1");
	params.set("orderby", "date");
	params.set("order", "desc");
	params.set("exclude", String(postId));

	if (Array.isArray(catIds) && catIds.length) {
		params.set("categories", catIds.join(","));
	}

	const lang = getLang();
	if (lang) {
		params.set("lang", lang);
	}

	return `/wp/v2/posts?${params.toString()}`;
};

export default function App({ postId, catIds = [], perPage = 6, title }) {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let canceled = false;

		setLoading(true);

		apiFetch({
			path: buildPath({ postId, catIds, perPage }),
		})
			.then((data) => {
				if (!canceled) {
					setPosts(Array.isArray(data) ? data : []);
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
		return <p>Loading...</p>;
	}

	if (!posts.length) {
		return null;
	}

	return (
		<section className="my-5">
	<h2 className="h3 mb-4">{title}</h2>

	<div
		className="row g-4"
	>
		{posts.map((p) => {
			const media = p?._embedded?.["wp:featuredmedia"]?.[0];
			const img = media?.source_url || "";
			const alt = media?.alt_text || "";

			return (
				<div
					key={p.id}
					className="col-12 col-sm-6 col-lg-4"
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
							className="text-body"
							dangerouslySetInnerHTML={{
								__html: p.title.rendered,
							}}
						/>
					</a>
				</div>
			);
		})}
	</div>
</section>
	);
}
