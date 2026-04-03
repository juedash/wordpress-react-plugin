import { createRoot } from "react-dom/client";
import App from "./app";

document.querySelectorAll(".bpffb-root").forEach((el) => {
	const perPage = Number(el.dataset.perPage || "6");
	const columns = Number(el.dataset.columns || "3");
	const archiveType = el.dataset.archiveType || "";
	const archiveId = Number(el.dataset.archiveId || "0");

	createRoot(el).render(
		<App
			perPage={perPage}
			columns={columns}
			archiveType={archiveType}
			archiveId={archiveId}
		/>
	);
});
