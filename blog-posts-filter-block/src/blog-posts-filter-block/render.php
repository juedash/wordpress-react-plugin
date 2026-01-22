<?php
/**
 * Server-side rendering of the block.
 *
 * @param array $attributes Block attributes.
 * @return void
 */

defined( 'ABSPATH' ) || exit;

$per_page = isset( $attributes['perPage'] ) ? (int) $attributes['perPage'] : 6;
$columns  = isset( $attributes['columns'] ) ? (int) $attributes['columns'] : 3;

$wrapper_attributes = get_block_wrapper_attributes();
?>


<div <?php echo $wrapper_attributes; ?>>
	<div
		class="bpffb-root"
		data-per-page="<?php echo esc_attr( $per_page ); ?>"
		data-columns="<?php echo esc_attr( $columns ); ?>"
	></div>
</div>
