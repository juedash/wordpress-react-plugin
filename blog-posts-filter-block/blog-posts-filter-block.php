<?php
/**
 * Plugin Name:       Blog Posts (filtrable)
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Jueda Sherifi
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       blog-posts-filter-block
 *
 * @package CreateBlock
 */

defined( 'ABSPATH' ) || exit;


add_action( 'init', function () {
	register_block_type( __DIR__ . '/build/blog-posts-filter-block' );

} );


if ( defined( 'BPFFB_USE_BOOTSTRAP_CDN' ) && BPFFB_USE_BOOTSTRAP_CDN ) {

	add_action( 'wp_enqueue_scripts', function () {
		wp_enqueue_style(
			'bpffb-bootstrap',
			'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
			array(),
			'5.3.3'
		);
	}, 20 );

	add_action( 'enqueue_block_editor_assets', function () {
		wp_enqueue_style(
			'bpffb-bootstrap-editor',
			'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
			array(),
			'5.3.3'
		);
	}, 20 );
}
