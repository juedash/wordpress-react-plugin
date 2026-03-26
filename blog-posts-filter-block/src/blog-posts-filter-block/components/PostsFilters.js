import { decodeEntities } from "@wordpress/html-entities";

export default function PostsFilters({
	loading,
	cats,
	activeCat,
	onSelect,
	skeletonCount = 6,
}) {
	if (loading) {
		return (
			<>
				<div className="d-md-none mb-3">
					<span className="form-select disabled placeholder-glow">
						<span className="placeholder col-8">&nbsp;</span>
					</span>
				</div>

				<ul className="nav nav-pills blog-filters mb-3 d-none d-md-flex flex-wrap">
					{Array.from({ length: skeletonCount }).map((_, i) => (
						<li className="nav-item" key={i}>
							<span className="nav-link filter-tab disabled placeholder-glow">
								<span className="placeholder col-8">&nbsp;</span>
							</span>
						</li>
					))}
				</ul>
			</>
		);
	}

	if (!cats || cats.length === 0) return null;

	return (
		<>
			<div className="d-md-none mb-3">
				<select
					className="form-select"
					value={String(activeCat)}
					onChange={(e) => onSelect(Number(e.target.value))}
				>
					<option value="0">{window.i18n?.viewAll ?? "View all"}</option>

					{cats.map((c) => (
						<option key={c.id} value={c.id}>
							{decodeEntities(c.name)}
						</option>
					))}
				</select>
			</div>

			<ul className="nav nav-pills blog-filters mb-3 d-none d-md-flex flex-wrap">
				<li className="nav-item">
					<button
						className={`nav-link filter-tab ${activeCat === 0 ? "active" : ""}`}
						style={{ padding: "0.5rem 0.75rem" }}
						onClick={() => onSelect(0)}
						type="button"
					>
						{window.i18n?.viewAll ?? "View all"}
					</button>
				</li>

				{cats.map((c) => (
					<li className="nav-item" key={c.id}>
						<button
							className={`nav-link filter-tab ${
								activeCat === c.id ? "active" : ""
							}`}
							style={{ padding: "0.5rem 0.75rem" }}
							onClick={() => onSelect(c.id)}
							type="button"
						>
							{decodeEntities(c.name)}
						</button>
					</li>
				))}
			</ul>
		</>
	);
}
