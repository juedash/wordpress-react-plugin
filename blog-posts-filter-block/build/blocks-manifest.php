<?php
// This file is generated. Do not modify it manually.
return array(
	'blog-posts-filter-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'bpffb/blog-posts-filter',
		'title' => 'Blog Posts Filter',
		'category' => 'widgets',
		'icon' => 'grid-view',
		'description' => 'Filterable posts grid with pagination.',
		'textdomain' => 'bpffb',
		'attributes' => array(
			'perPage' => array(
				'type' => 'number',
				'default' => 6
			),
			'columns' => array(
				'type' => 'number',
				'default' => 3
			)
		),
		'editorScript' => 'file:./index.js',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php'
	)
);
