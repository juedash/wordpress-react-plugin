## WordPress Custom Blocks

Custom WordPress blocks built using Bootstrap and React.

---

## Run the Project Locally

```bash
npx @wordpress/env start
```

---

## Build Plugin Archives

### Related Posts Plugin

```bash
zip -r blog-related-posts.zip blog-related-posts \
  -x "*/node_modules/*" \
  -x "*/src/*" \
  -x "*/.git/*" \
  -x "*/.github/*" \
  -x "*.map" \
  -x "*/package*.json" \
  -x "*/webpack.config.*" \
  -x "*/.eslintrc*" \
  -x "*/.prettierrc*" \
  -x "*.log"
```

---

### Grid Posts Plugin

```bash
zip -r blog-posts-filter-block.zip blog-posts-filter-block \
  -x "*/node_modules/*" \
  -x "*/src/*" \
  -x "*/.git/*" \
  -x "*/.github/*" \
  -x "*.map" \
  -x "*/package*.json" \
  -x "*/webpack.config.*" \
  -x "*/.eslintrc*" \
  -x "*/.prettierrc*" \
  -x "*.log"
```
