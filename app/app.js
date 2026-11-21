// Leonida Platinum: offline GTA VI trophy guide and tracker.
// Loads app/data/trophies.json (its own file, no network), renders the
// checklist, saves progress in localStorage, and offers filters, search,
// a spoiler setting, export/import, a roadmap and a missable list.
const KEY = 'gta6-leonida-platinum-v1';
const params = new URLSearchParams(location.search);
const rowsEl = document.getElementById('rows');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const spoilerEl = document.getElementById('spoiler');
const detailBody = document.getElementById('detailBody');
const detailTitle = document.getElementById('detailTitle');

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
let data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;
let kind = 'all';
let view = params.get('view') || 'checklist';
let selectedId = Number(params.get('trophy') || 0) || null;

// Demo seeding for screenshots: ?demo=1 checks 13 trophies, as the guide
// looks mid-playthrough. Only in the browser, never saved over real progress
// unless the reader ticks something afterwards.
if (params.get('demo') === '1') {
  earned = new Set([2, 3, 8, 10, 16, 21, 28, 35, 42, 44, 46, 53, 55]);
}
if (params.get('spoiler') === '1') spoilerEl.checked = true;

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function spoilerHidden(t) {
  return spoilerEl.checked && t.kind === 'story' && !earned.has(t.id);
}

function visibleTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kind === 'missable' && !t.missable) return false;
    if (kind === 'online') return false;
    if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) return false;
    if (gradeEl.value && t.grade !== gradeEl.value) return false;
    if (q && !(t.name + ' ' + t.description).toLowerCase().includes(q)) return false;
    return true;
  });
}

function gradeBadge(g) {
  return `<span class="badge ${g}">${g}</span>`;
}

function renderRows() {
  const list = visibleTrophies();
  document.getElementById('onlineNote').hidden = kind !== 'online';
  document.getElementById('resultCount').textContent =
    `${list.length} of 55 trophies · ${earned.size} earned`;
  rowsEl.innerHTML = list.map((t) => {
    const hidden = spoilerHidden(t);
    const name = hidden ? 'Hidden trophy — earn it to reveal' : escapeHtml(t.name);
    const desc = hidden ? 'Story trophy, hidden while spoiler-free mode is on.' : escapeHtml(t.description);
    return `<tr data-id="${t.id}" class="${earned.has(t.id) ? 'earned' : ''} ${selectedId === t.id ? 'selected' : ''}">
      <td><input type="checkbox" data-check="${t.id}" ${earned.has(t.id) ? 'checked' : ''} aria-label="Earned: ${escapeHtml(t.name)}"></td>
      <td class="name">${name}${t.missable ? ' <span class="flag">MISSABLE</span>' : ''}</td>
      <td class="desc">${desc}${t.target ? ` <span class="target">PSN target: ${t.target}</span>` : ''}</td>
      <td>${gradeBadge(t.grade)}</td>
      <td class="kind">${t.kind}</td>
    </tr>`;
  }).join('');
  renderProgress();
}

function renderProgress() {
  const n = earned.size;
  document.getElementById('earnedCount').textContent = n;
  document.getElementById('barFill').style.width = `${Math.round((n / 55) * 100)}%`;
  const byGrade = {};
  for (const t of trophies) if (earned.has(t.id)) byGrade[t.grade] = (byGrade[t.grade] || 0) + 1;
  document.getElementById('gradeCounts').textContent =
    ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
      const total = trophies.filter((t) => t.grade === g).length;
      return `${g} ${byGrade[g] || 0}/${total}`;
    }).join(' · ');
}

function renderDetail(t) {
  selectedId = t.id;
  detailTitle.textContent = t.name;
  detailBody.innerHTML = `
    <p>${gradeBadge(t.grade)} <span class="kind">${t.kind}</span>${t.missable ? ' <span class="flag">MISSABLE</span>' : ''}</p>
    <p class="official"><strong>Official description:</strong> ${escapeHtml(t.description)}</p>
    ${t.target ? `<p><strong>PSN target:</strong> ${t.target} (PSNProfiles)</p>` : ''}
    <h3>Guide</h3>
    <p>${escapeHtml(t.guide)}</p>
    ${t.missable ? '<p class="warn"><strong>When it can be missed:</strong> its trigger is a story mission, a stranger strand or a partner moment. Do it when it appears; if the game offers mission or chapter replay, a missed one can be recovered there.</p>' : ''}
    <h3>Sources</h3>
    <p class="sources">${escapeHtml(t.sources)}</p>`;
  renderRows();
}

const ROADMAP = [
  { stage: 'Stage 1 — Story, in order', text: 'Play Chapters 1–4 and the finale, doing every named story mission when it appears. This earns the 6 chapter trophies, the gold final-mission trophy, and the 6 named mission trophies (Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory). Never skip a story mission: treat each as missable until the game proves missions replayable.', ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { stage: 'Stage 2 — Strangers and partners, alongside the story', text: 'Play the stranger strands (Andy, Kenton, Billy, Randy, Tyrone) as they appear and finish 8 strands for the silver. Do the partner trophies the first time a partner free-roams with you: lose a 4-star wanted level together, and rob 3 shops back-to-back without losing the heat.', ids: [22, 23, 24, 25, 26, 27, 33, 34, 47] },
  { stage: 'Stage 3 — Activities', text: 'Sample all 9 activity types once, then work the grinds: 250 stunts, gold in all 42 Shooting Range challenges, drone races at all 14 locations, 20 different race wins, fishing against Cal, one arcade game, bowling, hunting for Bret, and 50 challenges.', ids: [15, 16, 17, 18, 19, 20, 21, 29, 32, 46] },
  { stage: 'Stage 4 — Collectibles and exploration', text: 'Tour all 52 areas of Leonida and fold the counts into the trip: meditate at all 18 spots, WAiNK It at 100 locations, complete 3 card sets, discover 100 vehicles, and watch for the strange event and the Ocean Beach cocktail along the way.', ids: [28, 30, 31, 35, 42, 44, 50] },
  { stage: 'Stage 5 — Combat, money and cleanup', text: 'Combat Focus for 5 takedowns in one use, the jewelry store undetected, 5 bank vaults, an armored truck, one illegal operation per gang, the Rhino encounter and the melee drive-by. Launder $250,000 in Marked Bills, spend $100,000 in shops, buy all 8 garages, register 10 vehicles, and let the 500 choices count land on its own. Then check the completion stat: 100% pops the gold, and the platinum follows.', ids: [36, 38, 39, 40, 41, 43, 45, 48, 49, 51, 52, 53, 54, 55, 14, 1] },
];

function renderRoadmap() {
  document.getElementById('roadmapStages').innerHTML = ROADMAP.map((s) => {
    const done = s.ids.filter((id) => earned.has(id)).length;
    const names = s.ids.map((id) => {
      const t = trophies.find((x) => x.id === id);
      return `<li class="${earned.has(id) ? 'done' : ''}">${escapeHtml(t.name)} <span class="kind">${t.grade}</span></li>`;
    }).join('');
    return `<li class="stage"><h3>${s.stage} <span class="stageCount">${done}/${s.ids.length} earned</span></h3><p>${s.text}</p><ul class="stageTrophies">${names}</ul></li>`;
  }).join('');
}

function renderMissables() {
  const list = trophies.filter((t) => t.missable);
  document.getElementById('missableList').innerHTML = list.map((t) =>
    `<li><strong>${escapeHtml(t.name)}</strong> ${gradeBadge(t.grade)} — ${escapeHtml(t.description)}<br>${escapeHtml(t.guide)}</li>`
  ).join('');
}

function setView(v) {
  view = v;
  document.querySelectorAll('#viewTabs button').forEach((b) => b.classList.toggle('active', b.dataset.view === v));
  document.querySelectorAll('main .view').forEach((s) => { s.hidden = s.id !== `view-${v}`; });
  if (v === 'roadmap') renderRoadmap();
  if (v === 'missables') renderMissables();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

rowsEl.addEventListener('click', (e) => {
  const check = e.target.closest('[data-check]');
  if (check) {
    const id = Number(check.dataset.check);
    if (check.checked) earned.add(id); else earned.delete(id);
    save();
    renderRows();
    return;
  }
  const row = e.target.closest('tr[data-id]');
  if (row) renderDetail(trophies.find((t) => t.id === Number(row.dataset.id)));
});
searchEl.addEventListener('input', renderRows);
gradeEl.addEventListener('change', renderRows);
spoilerEl.addEventListener('change', renderRows);
document.getElementById('kindFilters').addEventListener('click', (e) => {
  const b = e.target.closest('[data-kind]');
  if (!b) return;
  kind = b.dataset.kind;
  document.querySelectorAll('#kindFilters button').forEach((x) => x.classList.toggle('active', x === b));
  renderRows();
});
document.getElementById('viewTabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-view]');
  if (b) setView(b.dataset.view);
});
document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b), exported: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophies-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const valid = new Set(trophies.map((t) => t.id));
    earned = new Set(ids.filter((id) => valid.has(Number(id))).map(Number));
    save();
    renderRows();
    renderRoadmap();
  } catch { alert('That file is not a progress export from this guide.'); }
  e.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) {
    earned = new Set();
    save();
    renderRows();
  }
});

renderRows();
if (selectedId) {
  const t = trophies.find((x) => x.id === selectedId);
  if (t) renderDetail(t);
}
setView(view);
