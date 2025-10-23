import React from 'react';
import ReactDOM from 'react-dom';
import BlogFilters from './edit.js';

document.querySelectorAll('.blog-filters-dynamic-block').forEach((el) => {
  ReactDOM.render(<BlogFilters />, el);
});
