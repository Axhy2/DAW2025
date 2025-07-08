// script.js
const API = 'https://rickandmortyapi.com/api/character';
const btnAll = document.getElementById('btn-get-all');
const form   = document.getElementById('filter-form');
const out    = document.getElementById('results');

async function loadFilterOptions() {
  try {
    const first = await fetch(API).then(r => r.json());
    const pages = first.info.pages;
    // recolectamos resultados de todas las páginas
    const allResults = [ ...first.results ];
    const fetches = [];
    for (let p = 2; p <= pages; p++) {
      fetches.push(fetch(`${API}/?page=${p}`).then(r => r.json()));
    }
    const pagesData = await Promise.all(fetches);
    pagesData.forEach(d => allResults.push(...d.results));

    // extraemos únicos
    const statuses = new Set(), species = new Set(), types = new Set(), genders = new Set();
    allResults.forEach(c => {
      statuses.add(c.status);
      species.add(c.species);
      types.add(c.type);
      genders.add(c.gender);
    });

    populateSelect('status', statuses);
    populateSelect('species', species);
    populateSelect('type', types);
    populateSelect('gender', genders);

  } catch (e) {
    console.error('Error cargando filtros:', e);
  }
}

function populateSelect(name, valuesSet) {
  const sel = form.querySelector(`select[name="${name}"]`);
  Array.from(valuesSet)
    .filter(v => v)            // descartamos cadenas vacías
    .sort((a,b) => a.localeCompare(b))
    .forEach(v => {
      const o = document.createElement('option');
      o.value = v;
      o.textContent = v;
      sel.append(o);
    });
}

function render(chars) {
  out.innerHTML = '';
  if (!chars || chars.length === 0) {
    out.innerHTML = '<p class="error">No se encontraron personajes.</p>';
    return;
  }
  chars.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${c.image}" alt="${c.name}">
      <div class="info">
        <h3>${c.name}</h3>
        <p><strong>Estado:</strong> ${c.status}</p>
        <p><strong>Especie:</strong> ${c.species}</p>
        <p><strong>Tipo:</strong> ${c.type || 'N/A'}</p>
        <p><strong>Género:</strong> ${c.gender}</p>
      </div>
    `;
    out.append(card);
  });
}

async function getAll() {
  try {
    let url = API, all = [];
    while (url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      all = all.concat(data.results);
      url = data.info.next;
    }
    render(all);
  } catch (e) {
    out.innerHTML = `<p class="error">Error: ${e.message}</p>`;
  }
}

async function getFiltered(ev) {
  ev.preventDefault();
  const params = new URLSearchParams();
  new FormData(form).forEach((v,k) => v && params.append(k,v));
  try {
    const res = await fetch(`${API}/?${params}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || res.statusText);
    }
    const { results } = await res.json();
    render(results);
  } catch (e) {
    out.innerHTML = `<p class="error">Error: ${e.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadFilterOptions();
  btnAll.addEventListener('click', getAll);
  form.addEventListener('submit', getFiltered);
});
