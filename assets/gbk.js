const filters = document.querySelector('.filters');
const venues = [...document.querySelectorAll('[data-activity]')];
const status = document.querySelector('#venue-status');

filters.addEventListener('click', event => {
  const selected = event.target.closest('button');
  if (!selected) return;

  for (const button of filters.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button === selected));
  }
  for (const venue of venues) {
    venue.hidden = selected.value !== 'all' && venue.dataset.activity !== selected.value;
  }
  status.textContent = `${venues.filter(venue => !venue.hidden).length} venue ditampilkan.`;
});

for (const button of document.querySelectorAll('[data-open]')) {
  button.addEventListener('click', () => document.getElementById(button.dataset.open).showModal());
}
for (const button of document.querySelectorAll('[data-close]')) {
  button.addEventListener('click', () => button.closest('dialog').close());
}
