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
