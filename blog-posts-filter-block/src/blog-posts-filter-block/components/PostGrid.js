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

	return `${minutes} ${window.i18n?.minuteRead ?? "minute read"}`;
};

export default function PostGrid({ posts = [] }) {

	return (
		<div className="row gx-4 gy-5">
			{posts.map((p) => {
				const img = getFeaturedImage(p);
				const postCats = getCategories(p);
				const readTime = estimateReadTime(p?.content?.rendered || "");

				return (
					<article key={p.id} className="col-12 col-md-6 col-lg-4 d-flex flex-column justify-content-between border-0">
						{img.url && (
							<a href={p.link} className="mb-3">
								<img
									className="rounded"
									src={img.url}
									alt={img.alt}
									style={{
										width: "100%",
										aspectRatio: "16 / 9",
										objectFit: "cover",
									}}
									loading="lazy"
								/>
							</a>
						)}

						<div className="d-flex gap-3 align-items-center mb-2 flex-wrap">
							{postCats.map((t) => (
								<a
									key={t.id}
									href={t.link}
									className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis text-decoration-none border border-primary"
								>
									{decodeEntities(t.name)}
								</a>
							))}

							<span className="small text-muted">{readTime}</span>
						</div>
						<a href={p.link} className=" text-decoration-none">
							<h5
								class="text-body"
								dangerouslySetInnerHTML={{ __html: p.title.rendered }}
							/>
						</a>

						<div className="flex-grow-1 d-flex flex-column justify-content-between">
							<div
								className="mb-0 text-muted"
								dangerouslySetInnerHTML={{ __html: p.excerpt.rendered }}
							/>

							<a
								className="icon-link"
								href={p.link}
								style={{ width: "max-content" }}
							>
								{window.i18n?.readMore ?? "Read more"}
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
