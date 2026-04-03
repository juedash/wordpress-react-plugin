<?php
/**
 * Server-side rendering of the block.
 *
 * @param array $attributes Block attributes.
 * @return void
 */

defined( 'ABSPATH' ) || exit;

$handle = 'blog-related-posts-view-script';

wp_enqueue_script( $handle );

$strings = [
	'relatedPosts'  => function_exists( 'pll__' ) ? pll__( 'Related posts', 'blog-related-posts' ) : 'Related posts',
	'readMore'      => function_exists( 'pll__' ) ? pll__( 'Read more', 'blog-related-posts' ) : 'Read more',
	'loadPostsError'=> function_exists( 'pll__' ) ? pll__( 'Failed to load posts', 'blog-related-posts' ) : 'Error loading posts',
];

// Resolve current language via Polylang if available, otherwise fall back to WP locale.
$current_lang = '';
if ( function_exists( 'pll_current_language' ) ) {
	$current_lang = pll_current_language( 'slug' );
}
if ( ! $current_lang ) {
	$current_lang = strtolower( substr( get_locale(), 0, 2 ) );
}

$post_id = get_the_ID();
if ( ! $post_id ) {
	return;
}

$category_ids = wp_get_post_categories( $post_id );
$per_page     = 6;

wp_add_inline_script(
	$handle,
	'window.relatedPostsI18n = ' . wp_json_encode( $strings ) . '; window.relatedPostsData = ' . wp_json_encode(
		[
			'currentLang' => $current_lang,
		]
	) . ';',
	'before'
);

$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; ?>>
	<div
		class="bp-related-posts-root"
		data-post-id="<?php echo esc_attr( $post_id ); ?>"
		data-cat-ids="<?php echo esc_attr( implode( ',', $category_ids ) ); ?>"
		data-per-page="<?php echo esc_attr( $per_page ); ?>"
		data-title="<?php echo esc_attr( $strings['relatedPosts'] ); ?>"
	></div>
</div>
