<?php
// This file is generated. Do not modify it manually.
return array(
	'build' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'blog-filters/blog-filters',
		'version' => '0.1.0',
		'title' => 'Blog with Filters',
		'category' => 'widgets',
		'icon' => 'admin-blog',
		'description' => 'Example block scaffolded with Create Block tool.',
		'attributes' => array(
			'selectedCategory' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'blog-filters',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'script' => 'file:./render.js',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	)
);
