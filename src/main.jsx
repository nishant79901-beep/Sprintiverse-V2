import './runtime.css';

const showError = (error) => {
  const root = document.getElementById('root');
  if (!root) return;
  const message = error?.message || String(error || 'Unknown runtime error');
  console.error('Sprintiverse runtime error:', error);
  root.innerHTML = `<main class="runtime-error"><div><strong>Sprintiverse could not start.</strong><p>${message.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</p><button onclick="location.reload()">Reload</button></div></main>`;
};

window.addEventListener('error', (event) => showError(event.error || event.message));
window.addEventListener('unhandledrejection', (event) => showError(event.reason));

import('./Entry.jsx').catch(showError);
