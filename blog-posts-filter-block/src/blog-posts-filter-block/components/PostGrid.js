import { useMemo } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";

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

export default function PostGrid({ posts = [], gridStyle }) {
	const fallbackGridStyle = useMemo(
		() => ({
			display: "grid",
			gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			gap: "1.5rem",
		}),
		[],
	);

	const style = gridStyle || fallbackGridStyle;

	return (
		<div style={style}>
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
								<svg className="icon">
									<use href="/wp-content/themes/kp-theme/assets/fonts/icon.svg#chevron-right" />
								</svg>
							</a>
						</div>
					</article>
				);
			})}
		</div>
	);
}
