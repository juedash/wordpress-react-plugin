<?php
// This file is generated. Do not modify it manually.
return array(
	'blog-filters' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'blog-filters/blog-filters',
		'version' => '0.1.0',
		'title' => 'Blog with Filters',
		'category' => 'widgets',
		'icon' => 'admin-blog',
		'attributes' => array(
			'selectedCategory' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'supports' => array(
			'html' => false
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	)
);
