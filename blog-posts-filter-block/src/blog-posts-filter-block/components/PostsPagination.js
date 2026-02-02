import { useMemo } from "@wordpress/element";

export default function PostsPagination({
	page,
	totalPages,
	onPrev,
	onNext,
	onGoTo,
}) {
	const pageNumbers = useMemo(
		() => Array.from({ length: totalPages }, (_, i) => i + 1),
		[totalPages],
	);

	if (!totalPages || totalPages <= 1) return null;

	return (
		<div className="pagination justify-content-center mt-4 d-flex gap-2 align-items-center">
			{page > 1 && (
				<a className="prev-next icon-link" onClick={onPrev}>
					Previous
					<svg className="icon">
						<use href="/wp-content/themes/kp-theme/assets/fonts/icon.svg#chevron-left" />
					</svg>
				</a>
			)}

			<div className="d-flex gap-1">
				{pageNumbers.map((n) => (
					<a
						key={n}
						className={`page-numbers ${n === page ? "current" : ""}`}
						onClick={() => onGoTo(n)}
						aria-current={n === page ? "page" : undefined}
					>
						{n}
					</a>
				))}
			</div>

			{page < totalPages && (
				<a className="prev-next icon-link" onClick={onNext}>
					Next
					<svg className="icon">
						<use href="/wp-content/themes/kp-theme/assets/fonts/icon.svg#chevron-right" />
					</svg>
				</a>
			)}
		</div>
	);
}
