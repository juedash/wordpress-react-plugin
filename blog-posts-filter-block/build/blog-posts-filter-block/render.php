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
	'viewAll' => function_exists('pll__') ? pll__('View all', 'blog-posts-filter-block') : 'View all',
	'loadMore' => function_exists('pll__') ? pll__('Load more', 'blog-posts-filter-block') : 'Load more',
	'noResults' => function_exists('pll__') ? pll__('No results', 'blog-posts-filter-block') : 'No results',
	'readMore' => function_exists('pll__') ? pll__('Read more', 'blog-posts-filter-block') : 'Read more',
	'minuteRead' => function_exists('pll__') ? pll__('min read', 'blog-posts-filter-block') : 'minute read',
	'previous' => function_exists('pll__') ? pll__('Previous', 'blog-posts-filter-block') : 'Previous',
	'next' => function_exists('pll__') ? pll__('Next', 'blog-posts-filter-block') : 'Next',
	'loadPostsError' => function_exists('pll__') ? pll__('Failed to load posts', 'blog-posts-filter-block') : 'Error loading posts',

];

wp_add_inline_script(
	$handle,
	'window.i18n = ' . wp_json_encode($strings) . ';',
	'before'
);

$per_page = isset($attributes['perPage']) ? (int) $attributes['perPage'] : 6;
$columns = isset($attributes['columns']) ? (int) $attributes['columns'] : 3;

$default_cat = 0;
$show_filters = true;

if (is_category()) {
	$default_cat = (int) get_queried_object_id();
	$show_filters = false;
}
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="bpffb-root" data-per-page="<?php echo esc_attr($per_page); ?>"
		data-columns="<?php echo esc_attr($columns); ?>" data-default-cat="<?php echo esc_attr($default_cat); ?>"
		data-show-filters="<?php echo esc_attr($show_filters ? '1' : '0'); ?>"></div>
</div>
