const gbkMenuBtn = document.querySelector('[data-gbk-menu]');
if (gbkMenuBtn) {
  const navContainer = gbkMenuBtn.closest('.site-nav');
  gbkMenuBtn.addEventListener('click', () => {
    const isOpen = navContainer.classList.toggle('is-open');
    gbkMenuBtn.setAttribute('aria-expanded', String(isOpen));
    gbkMenuBtn.textContent = isOpen ? '✕ Tutup' : '☰ Menu';
  });
  document.addEventListener('click', event => {
    if (!navContainer.contains(event.target) && navContainer.classList.contains('is-open')) {
      navContainer.classList.remove('is-open');
      gbkMenuBtn.setAttribute('aria-expanded', 'false');
      gbkMenuBtn.textContent = '☰ Menu';
    }
  });
  for (const link of navContainer.querySelectorAll('nav a')) {
    link.addEventListener('click', () => {
      navContainer.classList.remove('is-open');
      gbkMenuBtn.setAttribute('aria-expanded', 'false');
      gbkMenuBtn.textContent = '☰ Menu';
    });
  }
}

const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const frames = [...carousel.querySelectorAll('[data-slide]')];
  let currentIndex = 0;
  let timerId = null;

  function selectFrame(index) {
    currentIndex = (index + frames.length) % frames.length;
    for (const [position, frame] of frames.entries()) {
      frame.hidden = position !== currentIndex;
    }
  }

  function startAutoSlide() {
    stopAutoSlide();
    if (frames.length > 1) {
      timerId = setInterval(() => {
        selectFrame(currentIndex + 1);
      }, 3800);
    }
  }

  function stopAutoSlide() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);
  carousel.addEventListener('focusin', stopAutoSlide);
  carousel.addEventListener('focusout', startAutoSlide);
  startAutoSlide();
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
    if (status) {
      status.hidden = false;
      status.textContent = `Menampilkan ${venues.filter(venue => !venue.hidden).length} arena berstandar internasional`;
    }
  }

  for (const button of buttons) button.addEventListener('click', () => filterVenues(button.value));
  if (buttons.some(button => button.value === requested)) filterVenues(requested);
}

const timeButtons = [...document.querySelectorAll('[data-time-slot]')];
const crowdOutput = document.querySelector('#crowd-output');
if (timeButtons.length && crowdOutput) {
  const slotData = {
    pagi: {
      title: 'Sesi Pagi (05.30–09.30 WIB) · Udara Segar & Komunitas Lari',
      desc: 'Waktu paling ideal untuk long run di Jalur Lingkar 3,5 km, bersepeda, dan piknik pagi di Hutan Kota. Gerbang utama Pintu 5 (MRT Istora) dan Pintu 10 beroperasi penuh.',
    },
    siang: {
      title: 'Sesi Siang (10.00–15.00 WIB) · Latihan Indoor & Kunjungan Tenang',
      desc: 'Kepadatan jalur luar sangat lengang. Waktu ideal untuk sesi latihan terjadwal di Istora, Stadion Akuatik, Tennis Indoor, atau bersantai di koridor kuliner Senayan.',
    },
    sore: {
      title: 'Sesi Sore & Malam (16.00–21.30 WIB) · Night Run & Pencahayaan Artistik',
      desc: 'Ring Road SUGBK dipenuhi pelari selepas jam kerja dengan latar pencahayaan megah fasad Temu Gelang. Gunakan MRT Jakarta untuk menghindari kepadatan lalu lintas sore.',
    },
  };

  for (const btn of timeButtons) {
    btn.addEventListener('click', () => {
      const key = btn.dataset.timeSlot;
      for (const b of timeButtons) b.setAttribute('aria-pressed', String(b === btn));
      const info = slotData[key];
      if (info) {
        crowdOutput.innerHTML = `<strong>${info.title}</strong><p>${info.desc}</p>`;
      }
    });
  }
}

const destination = document.querySelector('#destination');
if (destination) {
  const travel = document.querySelector('#travel');
  const route = document.querySelector('#route-link');
  const isSubpage = location.pathname.includes('/gbk/');
  const mapPrefix = isSubpage ? 'peta.html#' : 'gbk/peta.html#';
  const guidance = {
    transit: 'Turun di Stasiun MRT Istora Mandiri (Pintu 5/6) atau Halte TransJakarta GBK, lalu ikuti penunjuk arah pedestrian ke pin venue.',
    driving: 'Masuk melalui Pintu 10 (Jl. Asia Afrika) atau Pintu 5 (Jl. Sudirman) dan gunakan kantong parkir terdekat dari arena tujuan.',
    walking: 'Masuk melalui jalur hijau pedestrian Pintu 5, Pintu 6, atau Pintu 7 yang terhubung langsung dengan trotoar Sudirman.',
  };
  const note = document.createElement('p');
  note.className = 'note';
  note.setAttribute('role', 'status');
  route.after(note);
  function updateRoute() {
    const option = destination.selectedOptions[0];
    route.href = mapPrefix + option.dataset.pin;
    note.textContent = destination.value + ' — ' + guidance[travel.value];
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
