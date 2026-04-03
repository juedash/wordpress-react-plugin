<?php
/**
 * Server-side rendering of the block.
 *
 * @param array $attributes Block attributes.
 * @return void
 */

defined('ABSPATH') || exit;

$handle = 'bpffb-blog-posts-filter-view-script';

wp_enqueue_script($handle);

$strings = [
	'viewAll'       => function_exists('pll__') ? pll__('View all', 'blog-posts-filter-block')          : 'View all',
	'loadMore'      => function_exists('pll__') ? pll__('Load more', 'blog-posts-filter-block')         : 'Load more',
	'noResults'     => function_exists('pll__') ? pll__('No results', 'blog-posts-filter-block')        : 'No results',
	'readMore'      => function_exists('pll__') ? pll__('Read more', 'blog-posts-filter-block')         : 'Read more',
	'minuteRead'    => function_exists('pll__') ? pll__('min read', 'blog-posts-filter-block')          : 'minute read',
	'previous'      => function_exists('pll__') ? pll__('Previous', 'blog-posts-filter-block')          : 'Previous',
	'next'          => function_exists('pll__') ? pll__('Next', 'blog-posts-filter-block')              : 'Next',
	'loadPostsError'=> function_exists('pll__') ? pll__('Failed to load posts', 'blog-posts-filter-block') : 'Error loading posts',
];

// Resolve current language via Polylang (free) if available, otherwise fall back to WP locale.
$current_lang = '';
if ( function_exists( 'pll_current_language' ) ) {
	$current_lang = pll_current_language( 'slug' ); // e.g. 'en', 'de'
}
if ( ! $current_lang ) {
	// Fallback: derive a two-letter code from WP locale (e.g. 'en_US' → 'en').
	$current_lang = strtolower( substr( get_locale(), 0, 2 ) );
}

$per_page = (int) get_option( 'posts_per_page', 20 );
if ( $per_page < 1 ) {
	$per_page = 20;
}

$rest_url       = get_site_url( null, '/wp-json/wp/v2/posts' );
$categories_url = get_site_url( null, '/wp-json/wp/v2/categories' );

wp_add_inline_script(
	$handle,
	'window.i18n = ' . wp_json_encode( $strings ) . '; window.bpffbData = ' . wp_json_encode( [
		'restUrl'       => esc_url_raw( $rest_url ),
		'categoriesUrl' => esc_url_raw( $categories_url ),
		'currentLang'   => $current_lang,
		'postsPerPage'  => $per_page,
	] ) . ';',
	'before'
);

$columns = isset( $attributes['columns'] ) ? (int) $attributes['columns'] : 3;

$archive_type = '';
$archive_id   = 0;

if ( is_tag() ) {
	$archive_type = 'tag';
	$archive_id   = (int) get_queried_object_id();
} elseif ( is_author() ) {
	$archive_type = 'author';
	$archive_id   = (int) get_queried_object_id();
} elseif ( is_category() ) {
	$archive_type = 'category';
	$archive_id   = (int) get_queried_object_id();
}

$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; ?>>
	<div
		class="bpffb-root"
		data-per-page="<?php echo esc_attr( $per_page ); ?>"
		data-columns="<?php echo esc_attr( $columns ); ?>"
		data-archive-type="<?php echo esc_attr( $archive_type ); ?>"
		data-archive-id="<?php echo esc_attr( $archive_id ); ?>"
	></div>
</div>
