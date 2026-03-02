import { createRoot } from "react-dom/client";
import App from "./app";

document.querySelectorAll(".bpffb-root").forEach((el) => {
  const perPage = Number(el.dataset.perPage || "6");
  const columns = Number(el.dataset.columns || "3");
  const defaultCat = Number(el.dataset.defaultCat || "0");
  const showFilters = (el.dataset.showFilters || "1") === "1";

  createRoot(el).render(
    <App perPage={perPage} columns={columns} defaultCat={defaultCat} showFilters={showFilters} />
  );
});
