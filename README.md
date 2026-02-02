# WordPress Plugins Monorepo

This repo contains custom WordPress plugins. Right now there's one
plugin that provides a Gutenberg/Block Editor component: a posts grid
with category filters and pagination, powered by the WordPress REST API.

## Plugins

### Posts Grid (block / component)

A React component that renders:

-   A category filter bar (only categories that actually have posts)
-   A responsive CSS grid of posts
-   Featured image (via `_embed`)
-   Post categories (via `_embedded["wp:term"]`)
-   Estimated read time (based on post content)
-   Pagination based on the `X-WP-TotalPages` REST header
-   Basic language support via `document.documentElement.lang` (adds
    `lang=xx` to REST requests)

## How it works

The main component is `PostsGrid` and it relies on WordPress packages:

-   `@wordpress/element` for React hooks
-   `@wordpress/api-fetch` for REST API calls
-   `@wordpress/components` for the loading spinner
-   `@wordpress/html-entities` to decode category names

It fetches:

-   Categories:
    `/wp/v2/categories?per_page=100&hide_empty=1&lang=${lang}`
-   Posts:
    `/wp/v2/posts?per_page=...&page=...&_embed=1&orderby=date&order=desc&categories=...&lang=...`

It uses `parse: false` for the posts request so it can read response
headers and pull `X-WP-TotalPages`.

## Requirements

-   WordPress with REST API enabled (standard WP setup)
-   Block Editor environment (Gutenberg)
-   If you use multilingual routing (like Polylang), the REST API should
    accept a `lang` query param
-   Posts should have featured images set if you want images in the grid

## Installation

1.  Clone this repo into your WordPress plugins directory:

    `wp-content/plugins/`

2.  Install JS dependencies (inside the plugin folder that contains the
    block/component):

    ``` bash
    npm install
    ```

3.  Build assets:

    ``` bash
    npm run build
    ```

    For development:

    ``` bash
    npm run start
    ```

4.  Activate the plugin in WordPress Admin:

    Plugins → Installed Plugins → Activate

## Usage

How you mount `PostsGrid` depends on how the plugin registers it (block
registration, shortcode, or theme integration).

If it's registered as a Gutenberg block: - Add the block in the editor
and configure its attributes (if exposed): - `perPage` (default: 6) -
`columns` (default: 3)

If it's mounted manually (theme/plugin): - Render the wrapper element
and mount the React app where you need it.

## Props

`PostsGrid` supports:

-   `perPage` (number): how many posts per page (default `6`)
-   `columns` (number): number of grid columns (default `3`)

## Styling

The component uses a mix of Bootstrap-like utility classes and a couple
of custom class hooks:

-   `hide-wp-block-classes`
-   `blog-filters`
-   `bpffb-error`
-   `page-numbers`, `current`
-   `prev-next`

You'll likely want to ship CSS with the plugin or ensure your theme
provides the expected classes.

## Notes / Gotchas

-   The language is derived from `<html lang="...">` and truncated to
    the base language (e.g. `de-DE` → `de`).
-   Category filters only show categories with `count > 0`.
-   Read time is a simple estimate: strips HTML, counts words, assumes
    200 wpm.
-   Pagination depends on the REST header `X-WP-TotalPages`. If a
    proxy/cache strips headers, pagination may break.

## Repo structure (suggested)

    /plugins
      /posts-grid
        /src
        /build
        posts-grid.php
        package.json
    README.md

## License

Jueda Sherifi
