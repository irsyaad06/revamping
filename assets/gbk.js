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
  function updateRoute() {
    const params = new URLSearchParams({
      api: '1',
      destination: `${destination.value} GBK`,
      travelmode: travel.value,
    });
    route.href = `https://www.google.com/maps/dir/?${params}`;
  }
  for (const field of [destination, travel]) field.addEventListener('change', updateRoute);
}
