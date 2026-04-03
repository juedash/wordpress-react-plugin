import { createRoot } from "react-dom/client";
import App from "./app";

document.querySelectorAll(".bp-related-posts-root").forEach((el) => {
	const postId = Number(el.dataset.postId || "0");
	const catIds = (el.dataset.catIds || "")
		.split(",")
		.map((id) => Number(id))
		.filter(Boolean);
	const perPage = Number(el.dataset.perPage || "6");
	const title = el.dataset.title || "Related posts";

	createRoot(el).render(
		<App
			postId={postId}
			catIds={catIds}
			perPage={perPage}
			title={title}
		/>
	);
});
