const layout = document.querySelector('#layout');
const guests = document.querySelector('#guests');
const roomButtons = [...document.querySelectorAll('.room-list button')];
const rooms = roomButtons.map(button => ({
  button,
  panel: document.getElementById(button.getAttribute('aria-controls')),
}));
const roomStatus = document.querySelector('#room-status');
let activeRoom = rooms[0];

function matchesFilters(room) {
  const minimum = Math.max(0, Number(guests.value));
  return room.panel.dataset.config.split(',').some(configuration => {
    const [type, capacity] = configuration.split(':');
    const fitsLayout = layout.value === 'all' || type === layout.value;
    return fitsLayout && (!minimum || (capacity && Number(capacity) >= minimum));
  });
}

function renderRooms() {
  const matches = rooms.filter(matchesFilters);
  if (!matches.includes(activeRoom)) [activeRoom] = matches;

  for (const room of rooms) {
    room.button.hidden = !matches.includes(room);
    room.button.setAttribute('aria-pressed', String(room === activeRoom));
    room.panel.hidden = room !== activeRoom;
  }
  document.querySelector('#room-empty').hidden = matches.length > 0;
  roomStatus.textContent = activeRoom
    ? `${matches.length} ruang sesuai. Menampilkan ${activeRoom.panel.querySelector('h3').textContent}.`
    : 'Tidak ada ruang sesuai filter.';
}

layout.addEventListener('change', renderRooms);
guests.addEventListener('input', renderRooms);
for (const room of rooms) {
  room.button.addEventListener('click', () => {
    activeRoom = room;
    renderRooms();
  });
}

const proposal = document.querySelector('#proposal-form');
const roomChoice = document.querySelector('#room-choice');
const result = document.querySelector('#proposal-result');

for (const link of document.querySelectorAll('[data-room]')) {
  link.addEventListener('click', () => {
    roomChoice.value = link.dataset.room;
    result.textContent = '';
    roomChoice.focus({ preventScroll: true });
  });
}
proposal.querySelector('button').disabled = false;
proposal.addEventListener('input', () => {
  result.textContent = '';
});
proposal.addEventListener('submit', event => {
  event.preventDefault();
  result.textContent = 'Simulasi selesai. Formulir lolos validasi dan tidak dikirim ke JCC.';
});
