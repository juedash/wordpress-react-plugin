import { useMemo } from "@wordpress/element";

export default function PostsGridSkeleton() {
	const perPage = 6;
	const columns = 3;

	const gridStyle = useMemo(
		() => ({
			display: "grid",
			gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
			gap: "1.5rem",
		}),
		[columns],
	);

	return (
		<div style={gridStyle}>
			{Array.from({ length: perPage }).map((_, i) => (
				<article key={i}>
					<div className="card h-100 border-0" style={{backgroundColor: "red"}} aria-hidden="true">
						{/* image */}
						<span
							className="card-img-top placeholder"
							style={{ aspectRatio: "4 / 3", display: "block" }}
						/>

						<div className="card-body d-flex flex-column">
							{/* title */}
							<h5 className="card-title placeholder-glow">
								<span className="placeholder col-7" />
							</h5>

							{/* pills + read time */}
							<div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
								<span className="placeholder-glow">
									<span className="placeholder rounded-pill" style={{ width: "4.5rem" }}>
										&nbsp;
									</span>
								</span>
								<span className="placeholder-glow">
									<span className="placeholder rounded-pill" style={{ width: "4.5rem" }}>
										&nbsp;
									</span>
								</span>
								<span className="ms-auto placeholder-glow">
									<span className="placeholder rounded-pill" style={{ width: "3.5rem" }}>
										&nbsp;
									</span>
								</span>
							</div>

							{/* excerpt */}
							<p className="card-text placeholder-glow flex-grow-1">
								<span className="placeholder col-12" />
								<span className="placeholder col-12" />
								<span className="placeholder col-10" />
								<span className="placeholder col-8" />
							</p>

							{/* button */}
							<a
								href="#"
								tabIndex="-1"
								className="btn btn-primary disabled placeholder col-6"
								aria-disabled="true"
							/>
						</div>
					</div>
				</article>
			))}
		</div>
	);
}
