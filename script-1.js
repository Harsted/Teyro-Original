// ============================================================
// TEYRO ORIGINAL — Para editar productos, precios o el enlace de pedido,
// cambia solo esta sección.
// ============================================================
const PEDIDOS = 'https://ig.me/m/prendasteyrooriginal'; // Instagram. Cámbialo por tu WhatsApp si prefieres.

// Colores: [nombre, color 1, color 2 (opcional, para diseños de dos tonos), imagen]
const NEGRO = '#0a0a0a', BLANCO = '#f4f4f4';
const PRODUCTOS = [
  { nombre: 'Mala Fama', cat: 'camisetas', precio: 63900, colores: [
    ['Negro y dorado', NEGRO, '#b8860b', 'malafama-negro-dorado'],
    ['Negro y azul', NEGRO, '#1e90ff', 'malafama-negro-azul'],
    ['Blanco', BLANCO, null, 'malafama-blanco'],
    ['Azul rey', '#1a3fb5', null, 'malafama-azul-rey']] },
  { nombre: 'Alcolirykoz', cat: 'camisetas', precio: 52900, colores: [
    ['Blanco', BLANCO, null, 'alcolirykoz-blanco'],
    ['Negro', NEGRO, null, 'alcolirykoz-negro']] },
  { nombre: 'Butterfly', cat: 'camisetas', precio: 48900, colores: [
    ['Blanco', BLANCO, null, 'butterfly-blanco'],
    ['Negro', NEGRO, null, 'butterfly-negro']] },
  { nombre: 'Porsche 911 GT2 RS', cat: 'camisetas', precio: 47900, colores: [
    ['Negro y blanco', NEGRO, BLANCO, 'porsche-gt2rs']] },
  { nombre: 'Ángel', cat: 'camisetas', precio: 54900, colores: [
    ['Blanco', BLANCO, null, 'angel-blanco'],
    ['Negro', NEGRO, null, 'angel-negro']] },
  { nombre: 'Teyro Urbana', cat: 'camisetas', precio: 49900, colores: [
    ['Blanco', BLANCO, null, 'urbana-blanco']] },
  { nombre: 'Hoodie Silueta', cat: 'hoodies', precio: 87900, colores: [
    ['Blanco', BLANCO, null, 'hoodie-silueta-blanco'],
    ['Negro', NEGRO, null, 'hoodie-silueta-negro'],
    ['Negro y rojo', NEGRO, '#d61f1f', 'hoodie-silueta-rojo']] },
  { nombre: 'Hoodie Rostro', cat: 'hoodies', precio: 90900, colores: [
    ['Blanco', BLANCO, null, 'hoodie-cabeza-blanco'],
    ['Negro y morado', NEGRO, '#6f4cc4', 'hoodie-cabeza-negro-morado'],
    ['Rojo', '#d61f1f', null, 'hoodie-cabeza-rojo']] },
  { nombre: 'Hoodie Poseidón', cat: 'hoodies', precio: 92900, colores: [
    ['Blanco', BLANCO, null, 'hoodie-poseidon-blanco'],
    ['Rojo', '#b11212', null, 'hoodie-poseidon-rojo']] },
  { nombre: 'Gorra LA', cat: 'accesorios', precio: 29900, colores: [['Negro', NEGRO, null, 'gorra-la']] },
  { nombre: 'Cadena Lobo', cat: 'accesorios', precio: 40200, colores: [['Acero', '#9a9a9a', null, 'cadena-lobo']] },
  { nombre: 'Pulsera Lobo', cat: 'accesorios', precio: 25600, colores: [['Negro', NEGRO, null, 'pulsera-lobo']] },
];

// ============================================================
const grid = document.getElementById('grid');
const cop = n => '$' + n.toLocaleString('es-CO');
const src = f => `${f}.jpg`;

PRODUCTOS.forEach(p => {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.cat = p.cat;
  const multi = p.colores.length > 1;

  card.innerHTML = `
    <div class="shot"><img src="${src(p.colores[0][3])}" width="1200" height="800" loading="lazy" alt="${p.nombre} — ${p.colores[0][0]}"></div>
    <div class="info"><h3>${p.nombre}</h3><span class="price">${cop(p.precio)}</span></div>
    <div class="sub">
      ${multi ? '<div class="dots"></div>' : ''}
      <span class="color-name">${p.colores[0][0]}</span>
      <a class="order" href="${PEDIDOS}" rel="noopener" target="_blank">Pedir</a>
    </div>`;

  const img = card.querySelector('img');
  const label = card.querySelector('.color-name');
  const dots = card.querySelector('.dots');

  if (dots) {
    p.colores.forEach(([nombre, c1, c2, file], i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `${p.nombre}, color ${nombre}`);
      b.setAttribute('aria-pressed', String(i === 0));
      b.style.background = c2 ? `linear-gradient(135deg, ${c1} 50%, ${c2} 50%)` : c1;
      b.addEventListener('click', () => {
        dots.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        label.textContent = nombre;
        img.classList.add('swap');
        setTimeout(() => { img.src = src(file); img.alt = `${p.nombre} — ${nombre}`; img.classList.remove('swap'); }, 160);
      });
      dots.appendChild(b);
    });
  }
  grid.appendChild(card);
});

document.querySelectorAll('.filtros button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtros button').forEach(b => b.classList.toggle('on', b === btn));
    grid.querySelectorAll('.card').forEach(c => { c.hidden = btn.dataset.f !== 'todos' && c.dataset.cat !== btn.dataset.f; });
  });
});
