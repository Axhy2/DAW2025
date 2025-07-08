// script.js
const API = 'https://rickandmortyapi.com/api/character';
const btnAll = document.getElementById('btn-get-all');
const form  = document.getElementById('filter-form');
const out   = document.getElementById('results');

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
        <p>Estado: ${c.status}</p>
        <p>Especie: ${c.species}</p>
        <p>Género: ${c.gender}</p>
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
  new FormData(form).forEach((v,k)=> v && params.append(k,v));
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

btnAll.addEventListener('click', getAll);
form.addEventListener('submit', getFiltered);