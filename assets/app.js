const filter = document.querySelector('[data-filters]');
if (filter) {
  const cards = [...document.querySelectorAll('[data-category]')];
  const options = [...filter.querySelectorAll('button')];
  const capacity = document.querySelector('#capacity');
  const count = document.querySelector('#result-count');

  function render() {
    const category = options.find(button => button.getAttribute('aria-pressed') === 'true').value;
    let matches = 0;
    for (const card of cards) {
      const categoryMatches = category === 'all' || card.dataset.category === category;
      const capacityMatches = !capacity || Number(card.dataset.capacity) >= Number(capacity.value);
      card.hidden = !(categoryMatches && capacityMatches);
      if (!card.hidden) matches += 1;
    }
    count.textContent = matches ? `${matches} venue ditampilkan` : 'Tidak ada venue yang sesuai. Ubah filter untuk melihat pilihan lain.';
  }

  for (const option of options) {
    option.addEventListener('click', () => {
      for (const button of options) button.setAttribute('aria-pressed', String(button === option));
      render();
    });
  }
  capacity?.addEventListener('change', render);
  render();
}

for (const trigger of document.querySelectorAll('[data-dialog]')) {
  trigger.addEventListener('click', () => {
    const dialog = document.getElementById(trigger.dataset.dialog);
    trigger.closest("dialog")?.close();
    const venue = dialog.querySelector('[name="venue"]');
    if (venue) venue.value = trigger.dataset.venue || '';
    dialog.showModal();
  });
}
for (const close of document.querySelectorAll('[data-close]')) {
  close.addEventListener('click', () => close.closest('dialog').close());
}
const inquiry = document.querySelector('#inquiry-form');
inquiry?.addEventListener('submit', event => {
  event.preventDefault();
  inquiry.closest('dialog').close();
  document.querySelector('#confirmation').showModal();
  inquiry.reset();
});
