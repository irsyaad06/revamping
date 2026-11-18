const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const frames = [...carousel.querySelectorAll('[data-slide]')];
  const controls = [...carousel.querySelectorAll('[data-frame]')];

  function selectFrame(index) {
    for (const [position, frame] of frames.entries()) {
      frame.hidden = position !== index;
      controls[position].setAttribute('aria-pressed', String(position === index));
    }
  }

  for (const [index, button] of controls.entries()) {
    button.addEventListener('click', () => selectFrame(index));
    button.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      const next = (index + step + controls.length) % controls.length;
      selectFrame(next);
      controls[next].focus();
    });
  }
}

const filters = document.querySelector('.gx-filter');
if (filters) {
  const buttons = [...filters.querySelectorAll('button')];
  const venues = [...document.querySelectorAll('[data-sport]')];
  const status = document.querySelector('#gbk-result');
  const requested = new URLSearchParams(location.search).get('olahraga');

  function filterVenues(value) {
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.value === value));
    for (const venue of venues) venue.hidden = value !== 'all' && venue.dataset.sport !== value;
    status.textContent = `${venues.filter(venue => !venue.hidden).length} venue`;
  }

  for (const button of buttons) button.addEventListener('click', () => filterVenues(button.value));
  if (buttons.some(button => button.value === requested)) filterVenues(requested);
}

const destination = document.querySelector('#destination');
if (destination) {
  const travel = document.querySelector('#travel');
  const route = document.querySelector('#route-link');
  const guidance = {
    transit: 'Cek akses dari stasiun MRT atau halte. Lanjutkan ke titik venue pada skema kawasan.',
    driving: 'Cocokkan gerbang kendaraan dan titik drop-off dengan informasi penyelenggara.',
    walking: 'Gunakan jalur pejalan kaki dan ikuti petunjuk petugas pada hari acara.',
  };
  const note = document.createElement('p');
  note.className = 'note';
  note.setAttribute('role', 'status');
  route.after(note);
  function updateRoute() {
    const option = destination.selectedOptions[0];
    route.href = 'peta.html#' + option.dataset.pin;
    note.textContent = destination.value + '. ' + guidance[travel.value];
  }
  for (const field of [destination, travel]) field.addEventListener('change', updateRoute);
  updateRoute();
}

const booking = document.querySelector('[data-demo-booking]');
if (booking) {
  const venue = document.querySelector('#book-venue');
  const date = document.querySelector('#book-date');
  const slot = document.querySelector('#book-slot');
  const result = document.querySelector('#booking-result');
  const requested = new URLSearchParams(location.search).get('venue');
  if ([...venue.options].some(option => option.value === requested)) venue.value = requested;
  booking.querySelector('button').disabled = false;
  booking.addEventListener('input', () => { result.textContent = ''; });
  booking.addEventListener('submit', event => {
    event.preventDefault();
    const when = new Date(date.value + 'T00:00:00').toLocaleDateString('id-ID', { dateStyle: 'long' });
    result.textContent = `Simulasi · ${venue.selectedOptions[0].textContent} · ${when} · ${slot.value} WIB. Belum ada pemesanan nyata.`;
  });
}
