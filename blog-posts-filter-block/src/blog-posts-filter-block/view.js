import { createRoot } from 'react-dom/client';
import App from './app';

document.querySelectorAll('.bpffb-root').forEach((el) => {
  const perPage = Number(el.dataset.perPage || '6');
  const columns = Number(el.dataset.columns || '3');

  createRoot(el).render(<App perPage={perPage} columns={columns} />);
});
