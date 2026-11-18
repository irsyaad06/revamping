// Top Menu Drawer Toggle
const menuToggle = document.querySelector('[data-menu-toggle]');
const menuDrawer = document.querySelector('#jcc-drawer');
if (menuToggle && menuDrawer) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuDrawer.hidden = expanded;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menuDrawer.hidden) {
      menuDrawer.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }
  });
}

const SVG_UP_RIGHT = '<svg class="ic" viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12L12 4M5.5 4H12v6.5"/></svg>';

// Interactive Event Lookbook Tabs on Homepage
const lookbookButtons = [...document.querySelectorAll('[data-lookbook]')];
if (lookbookButtons.length) {
  const scenarios = {
    summit: {
      img1: 'assets/jcc-plenary.webp',
      cap1: 'Plenary Hall · Sidang Pembukaan 5.000 Delegasi',
      img2: 'assets/jcc-summit.webp',
      cap2: 'Cendrawasih & Lower Lobby · Ruang Bilateral',
      eyebrow: 'Protokol Kenegaraan & Kongres',
      title: 'KTT Internasional & Simposium Global',
      desc: 'Sejak KTT Non-Blok 1992 hingga ASEAN Summit, JCC menyediakan jalur kedatangan kepala negara yang terpisah, ruang sidang kedap suara, pusat media berkecepatan tinggi, dan konektivitas langsung.',
      stat1: '5.000 Kursi',
      label1: 'Kapasitas Sesi Pleno Utama',
      stat2: '13 Ruang',
      label2: 'Breakout & Komisi Paralel',
      link: 'jcc/acara-forum.html',
      linkText: `Lihat Studi Kasus Forum ${SVG_UP_RIGHT}`,
    },
    gala: {
      img1: 'assets/jcc-gala.webp',
      cap1: 'Assembly Hall · Royal Wedding & Gala Dinner',
      img2: 'assets/jcc-assembly.webp',
      cap2: 'Chandelier Ballroom & Tata Meja Bundar',
      eyebrow: 'Perayaan Agung & Jamuan Malam',
      title: 'Pernikahan Megah & Gala Dinner Eksklusif',
      desc: 'Wujudkan resepsi impian atau malam penghargaan korporat di Assembly Hall dan Cendrawasih Room dengan plafon tinggi, dekorasi floral gantung, dan sajian kuliner bintang lima.',
      stat1: '2.500 Tamu',
      label1: 'Jamuan Duduk Meja Bundar',
      stat2: '4.500 Tamu',
      label2: 'Resepsi Standing Buffet',
      link: 'jcc/assembly.html',
      linkText: `Jelajahi Assembly Hall ${SVG_UP_RIGHT}`,
    },
    expo: {
      img1: 'assets/jcc-exhibition.webp',
      cap1: 'Exhibition Hall A & B · Bentang Tanpa Kolom',
      img2: 'assets/jcc-venue.webp',
      cap2: 'Main Lobby · Area Registrasi & Paviliun Sponsor',
      eyebrow: 'Pameran Dagang & Eksibisi Publik',
      title: 'Pameran Lintas Industri & Trade Show',
      desc: 'Gabungan Exhibition Hall A dan Hall B menghadirkan lantai pameran seluas 9.585 m² dengan plafon 9 meter, saluran utilitas bawah lantai, dan akses truk langsung ke dalam hall.',
      stat1: '9.585 m²',
      label1: 'Luas Gabungan Hall A & B',
      stat2: '1.500 kg/m²',
      label2: 'Kapasitas Beban Lantai',
      link: 'jcc/acara-expo.html',
      linkText: `Lihat Skema Pameran ${SVG_UP_RIGHT}`,
    },
    concert: {
      img1: 'assets/jcc-hero.webp',
      cap1: 'Plenary & Assembly · Panggung Konser Spektakuler',
      img2: 'assets/jcc-plenary.webp',
      cap2: 'Balkon 360° dengan Jarak Pandang Intim',
      eyebrow: 'Pertunjukan Musik & Budaya',
      title: 'Konser Orkestra, Jazz Festival & Pertunjukan',
      desc: 'Akustik ruang yang hangat dan tata tempat duduk bertingkat di Plenary Hall menghadirkan pengalaman konser berskala besar yang tetap intim bagi setiap penonton.',
      stat1: '5.000 Penonton',
      label1: 'Konfigurasi Auditorium & Festival',
      stat2: '360° Pandang',
      label2: 'Tata Kursi Lantai Utama & Balkon',
      link: 'jcc/plenary.html',
      linkText: `Spesifikasi Plenary Hall ${SVG_UP_RIGHT}`,
    },
  };

  for (const btn of lookbookButtons) {
    btn.addEventListener('click', () => {
      const data = scenarios[btn.dataset.lookbook];
      if (!data) return;
      for (const b of lookbookButtons) b.setAttribute('aria-pressed', String(b === btn));
      document.querySelector('#lb-img-1').src = data.img1;
      document.querySelector('#lb-cap-1').textContent = data.cap1;
      document.querySelector('#lb-img-2').src = data.img2;
      document.querySelector('#lb-cap-2').textContent = data.cap2;
      document.querySelector('#lb-eyebrow').textContent = data.eyebrow;
      document.querySelector('#lb-title').textContent = data.title;
      document.querySelector('#lb-desc').textContent = data.desc;
      document.querySelector('#lb-stat-1').textContent = data.stat1;
      document.querySelector('#lb-label-1').textContent = data.label1;
      document.querySelector('#lb-stat-2').textContent = data.stat2;
      document.querySelector('#lb-label-2').textContent = data.label2;
      const link = document.querySelector('#lb-link');
      link.href = data.link;
      link.innerHTML = data.linkText;
    });
  }
}

const setup = document.querySelector('#setup');
if (setup) {
  const attendance = document.querySelector('#attendance');
  const cards = [...document.querySelectorAll('[data-room-card]')].map(card => ({
    card,
    options: Object.entries(JSON.parse(card.dataset.config)),
  }));
  const empty = document.querySelector('#no-rooms');
  const count = document.querySelector('#room-count');

  function filterRooms() {
    const minimum = Math.max(0, Number(attendance.value));
    for (const { card, options } of cards) {
      card.hidden = !options.some(([name, capacity]) => (
        (!setup.value || name === setup.value) && (!minimum || (capacity !== null && capacity >= minimum))
      ));
    }
    const total = cards.filter(({ card }) => !card.hidden).length;
    count.textContent = `${total} ruang sesuai`;
    empty.hidden = total !== 0;
  }

  setup.addEventListener('change', filterRooms);
  attendance.addEventListener('input', filterRooms);
}

const comparison = document.querySelector('#comparison');
if (comparison) {
  const rooms = JSON.parse(document.querySelector('#room-data').textContent);
  const choices = [document.querySelector('#compare-a'), document.querySelector('#compare-b')];
  const format = new Intl.NumberFormat('id-ID');

  function tableCell(row, type, value, scope) {
    const cell = document.createElement(type);
    cell.textContent = value;
    if (scope) cell.scope = scope;
    row.append(cell);
  }

  function compareRooms() {
    const [left, right] = choices.map(choice => rooms.find(room => room.id === choice.value));
    if (left === right) {
      comparison.textContent = 'Pilih dua ruang yang berbeda untuk membandingkan.';
      return;
    }

    const table = document.createElement('table');
    table.setAttribute('aria-label', 'Perbandingan kapasitas dan spesifikasi');
    const header = table.createTHead().insertRow();
    for (const value of ['Konfigurasi', left.name, right.name]) tableCell(header, 'th', value, 'col');

    const body = table.createTBody();
    const layouts = new Set([...Object.keys(left.spec), ...Object.keys(right.spec)]);
    const capacityLabel = value => value === undefined ? '—' : value === null ? 'Konfirmasi' : format.format(value);
    for (const layout of layouts) {
      const row = body.insertRow();
      tableCell(row, 'th', layout, 'row');
      tableCell(row, 'td', capacityLabel(left.spec[layout]));
      tableCell(row, 'td', capacityLabel(right.spec[layout]));
    }

    const main = body.insertRow();
    tableCell(main, 'th', 'Spesifikasi utama', 'row');
    tableCell(main, 'td', left.fact);
    tableCell(main, 'td', right.fact);

    const wrapper = document.createElement('div');
    wrapper.className = 'table-scroll';
    wrapper.setAttribute('aria-label', 'Tabel perbandingan ruang');
    wrapper.setAttribute('role', 'region');
    wrapper.tabIndex = 0;
    wrapper.append(table);
    comparison.replaceChildren(wrapper);
  }
  for (const choice of choices) choice.addEventListener('change', compareRooms);
  compareRooms();
}

const briefForm = document.querySelector('#brief-form');
if (briefForm) {
  const room = document.querySelector('#brief-room');
  const requested = new URLSearchParams(location.search).get('ruang');
  if ([...room.options].some(option => option.value === requested)) room.value = requested;

  const result = document.querySelector('#brief-result');
  const copy = document.querySelector('#copy-brief');
  const message = document.querySelector('#copy-message');
  const output = result.closest('.brief-output');
  briefForm.querySelector('button').disabled = false;

  briefForm.addEventListener('input', event => {
    if (!output.contains(event.target)) output.hidden = true;
  });

  briefForm.addEventListener('submit', event => {
    event.preventDefault();
    const field = id => document.getElementById(id).value;
    const date = new Date(`${field('brief-date')}T00:00:00`).toLocaleDateString('id-ID', { dateStyle: 'long' });
    result.value = [
      'Brief acara — Jakarta Convention Center',
      `Ruang: ${room.selectedOptions[0].textContent}`,
      `Jenis: ${field('brief-kind')}`,
      `Tanggal: ${date}`,
      `Perkiraan peserta: ${field('brief-guests')}`,
      `Layout dan teknis: ${field('brief-notes').trim() || 'Akan didiskusikan'}`,
    ].join('\n');
    message.textContent = '';
    output.hidden = false;
    result.focus();
  });

  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(result.value);
      message.textContent = 'Ringkasan disalin.';
    } catch {
      result.focus();
      result.select();
      message.textContent = 'Teks sudah dipilih. Gunakan perintah Salin di perangkat Anda.';
    }
  });
}
