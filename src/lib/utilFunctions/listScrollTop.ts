export function listScrollTop() {
  const el = document.getElementById('_bank-service-wrapper');
  if (el) {
    el.scrollTo({ behavior: 'smooth', top: 0 });
  }
}
