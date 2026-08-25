// ============================================================
// TEYRO ORIGINAL — SCRIPT PRINCIPAL
// Índice:
// 1. Menú móvil a pantalla completa
// 2. Barra de progreso de scroll
// 3. Navegación por puntos + resaltado de link activo
// 4. Filtro y orden de catálogo
// 5. Favoritos (localStorage)
// 6. Dropdown de categorías (nav superior)
// 7. Buscador
// 8. Countdown del próximo drop
// 9. Acordeón de FAQ
// 10. Formulario de contacto + newsletter
// 11. Botón "volver arriba" + toast
// 12. Animación al hacer scroll (reveal)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. MENÚ MÓVIL A PANTALLA COMPLETA
  // ============================================
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu(){
    mobileMenu.classList.remove('open');
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  burgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burgerBtn.classList.toggle('open', isOpen);
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      closeMobileMenu();
      const cat = link.dataset.cat;
      if (cat) {
        e.preventDefault();
        aplicarFiltro(cat);
        document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // 2. BARRA DE PROGRESO DE SCROLL
  // ============================================
  const scrollProgress = document.getElementById('scrollProgress');
  function actualizarProgreso(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }

  // ============================================
  // 3. NAVEGACIÓN POR PUNTOS + LINK ACTIVO
  // ============================================
  const dotLinks = document.querySelectorAll('.dot-nav a');
  const navLinkEls = document.querySelectorAll('.nav-links > li > a[data-nav]');
  const seccionesNav = ['inicio','ofertas','catalogo','galeria','nosotros','faq','contacto']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function actualizarNavActiva(){
    const scrollPos = window.scrollY + 160;
    let actualId = seccionesNav[0] ? seccionesNav[0].id : null;
    seccionesNav.forEach(sec => {
      if (sec.offsetTop <= scrollPos) actualId = sec.id;
    });

    dotLinks.forEach(a => a.classList.toggle('active', a.dataset.target === actualId));
    navLinkEls.forEach(a => a.classList.toggle('active', a.dataset.nav === actualId));
  }

  // ============================================
  // 4. FILTRO Y ORDEN DE CATÁLOGO
  // ============================================
  const filtroBtns = document.querySelectorAll('.filtro-btn');
  const prodCards = document.querySelectorAll('.prod-card');
  const prodGrid = document.getElementById('prodGrid');
  const emptyState = document.getElementById('emptyState');
  const sortSelect = document.getElementById('sortSelect');
  let filtroActivo = 'todos';

  function aplicarFiltro(valor){
    filtroActivo = valor;
    filtroBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === valor));

    let visibles = 0;
    prodCards.forEach(card => {
      let coincide;
      if (valor === 'todos') coincide = true;
      else if (valor === 'favoritos') coincide = favoritos.includes(card.dataset.id === undefined ? card.querySelector('.fav-btn').dataset.id : card.dataset.id);
      else coincide = card.dataset.cat === valor;

      card.style.display = coincide ? '' : 'none';
      if (coincide) visibles++;
    });
    emptyState.hidden = visibles !== 0;
  }

  filtroBtns.forEach(btn => {
    btn.addEventListener('click', () => aplicarFiltro(btn.dataset.filter));
  });

  sortSelect.addEventListener('change', () => {
    const cards = Array.from(prodCards);
    const valor = sortSelect.value;

    cards.sort((a, b) => {
      if (valor === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
      if (valor === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
      if (valor === 'name-asc') return a.dataset.name.localeCompare(b.dataset.name);
      return 0; // 'default' conserva el orden original
    });

    if (valor === 'default') {
      // Restaura el orden original según el atributo data-name en su posición del DOM inicial
      cards.sort((a, b) => Array.from(prodGrid.children).indexOf(a) - Array.from(prodGrid.children).indexOf(b));
    }

    cards.forEach(card => prodGrid.appendChild(card));
  });

  // Enlaces de categorías dentro del dropdown del menú superior
  document.querySelectorAll('.dropdown-menu a[data-cat]').forEach(link => {
    link.addEventListener('click', (e) => {
      aplicarFiltro(link.dataset.cat);
      document.getElementById('catDropdown').classList.remove('open');
    });
  });

  // ============================================
  // 5. FAVORITOS (localStorage)
  // ============================================
  const FAV_KEY = 'teyro-favoritos';
  let favoritos = [];
  try {
    favoritos = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch (e) {
    favoritos = [];
  }

  const favBtns = document.querySelectorAll('.fav-btn');
  const favBadge = document.getElementById('favBadge');
  const favToggle = document.getElementById('favToggle');

  function guardarFavoritos(){
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favoritos)); } catch (e) { /* almacenamiento no disponible */ }
  }

  function pintarFavoritos(){
    favBtns.forEach(btn => {
      const activo = favoritos.includes(btn.dataset.id);
      btn.classList.toggle('active', activo);
      btn.setAttribute('aria-pressed', String(activo));
    });
    favBadge.hidden = favoritos.length === 0;
    favBadge.textContent = favoritos.length;
    favToggle.classList.toggle('is-fav', favoritos.length > 0);
  }

  favBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const nombre = btn.closest('.prod-card').dataset.name;
      if (favoritos.includes(id)) {
        favoritos = favoritos.filter(f => f !== id);
        mostrarToast(nombre + ' se quitó de favoritos');
      } else {
        favoritos.push(id);
        mostrarToast(nombre + ' se guardó en favoritos');
      }
      guardarFavoritos();
      pintarFavoritos();
      if (filtroActivo === 'favoritos') aplicarFiltro('favoritos');
    });
  });

  favToggle.addEventListener('click', () => {
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
    aplicarFiltro('favoritos');
  });

  pintarFavoritos();

  // ============================================
  // 6. DROPDOWN DE CATEGORÍAS (nav superior)
  // ============================================
  const catDropdown = document.getElementById('catDropdown');
  const catDropdownToggle = document.getElementById('catDropdownToggle');
  catDropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const abierto = catDropdown.classList.toggle('open');
    catDropdownToggle.setAttribute('aria-expanded', String(abierto));
  });
  document.addEventListener('click', (e) => {
    if (!catDropdown.contains(e.target)) {
      catDropdown.classList.remove('open');
      catDropdownToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ============================================
  // 7. BUSCADOR
  // ============================================
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchCount = document.getElementById('searchCount');

  searchToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    searchBar.classList.toggle('open');
    if (searchBar.classList.contains('open')) {
      setTimeout(() => searchInput.focus(), 150);
    }
  });
  document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target) && e.target !== searchToggle) {
      searchBar.classList.remove('open');
    }
  });

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();

    if (term === ''){
      aplicarFiltro(filtroActivo);
      searchCount.textContent = '';
      return;
    }

    let visibles = 0;
    prodCards.forEach(card => {
      const nombre = card.querySelector('h3').textContent.toLowerCase();
      const categoria = card.dataset.cat.toLowerCase();
      const coincide = nombre.includes(term) || categoria.includes(term);
      card.style.display = coincide ? '' : 'none';
      if (coincide) visibles++;
    });
    emptyState.hidden = visibles !== 0;
    searchCount.textContent = visibles + (visibles === 1 ? ' resultado' : ' resultados');
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchBar.classList.remove('open');
    }
  });

  // ============================================
  // 8. COUNTDOWN DEL PRÓXIMO DROP
  // Cambia esta fecha por la fecha real de tu próximo lanzamiento.
  // ============================================
  const FECHA_DROP = new Date();
  FECHA_DROP.setDate(FECHA_DROP.getDate() + 6); // demo: 6 días desde que se carga la página
  FECHA_DROP.setHours(20, 0, 0, 0);

  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMin = document.getElementById('cdMin');
  const cdSec = document.getElementById('cdSec');

  function actualizarCountdown(){
    const diff = FECHA_DROP.getTime() - Date.now();
    if (diff <= 0){
      cdDays.textContent = cdHours.textContent = cdMin.textContent = cdSec.textContent = '00';
      return;
    }
    const dias = Math.floor(diff / 86400000);
    const horas = Math.floor((diff % 86400000) / 3600000);
    const min = Math.floor((diff % 3600000) / 60000);
    const seg = Math.floor((diff % 60000) / 1000);

    cdDays.textContent = String(dias).padStart(2, '0');
    cdHours.textContent = String(horas).padStart(2, '0');
    cdMin.textContent = String(min).padStart(2, '0');
    cdSec.textContent = String(seg).padStart(2, '0');
  }
  actualizarCountdown();
  setInterval(actualizarCountdown, 1000);

  // ============================================
  // 9. ACORDEÓN DE FAQ
  // ============================================
  document.querySelectorAll('.faq-item').forEach(item => {
    const pregunta = item.querySelector('.faq-question');
    pregunta.addEventListener('click', () => {
      const abierta = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(otra => {
        otra.classList.remove('open');
        otra.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!abierta){
        item.classList.add('open');
        pregunta.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ============================================
  // 10. FORMULARIO DE CONTACTO + NEWSLETTER
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  function limpiarErrores(){
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    limpiarErrores();

    let valido = true;
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');

    if (!nombre.value.trim()){
      document.getElementById('err-nombre').textContent = 'Escribe tu nombre.';
      valido = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){
      document.getElementById('err-email').textContent = 'Escribe un correo válido.';
      valido = false;
    }
    if (!mensaje.value.trim()){
      document.getElementById('err-mensaje').textContent = 'Cuéntanos en qué te ayudamos.';
      valido = false;
    }

    if (!valido) return;

    formMsg.classList.add('show');
    contactForm.reset();
    mostrarToast('Mensaje enviado');
  });

  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterMsg.classList.add('show');
    newsletterForm.reset();
  });

  // ============================================
  // 11. BOTÓN "VOLVER ARRIBA" + TOAST
  // ============================================
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const toast = document.getElementById('toast');
  let toastTimeout;
  function mostrarToast(texto){
    toast.textContent = texto;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ============================================
  // 12. ANIMACIÓN AL HACER SCROLL (reveal)
  // ============================================
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  // ============================================
  // LISTENER DE SCROLL (progreso + nav activa + back to top)
  // ============================================
  function alHacerScroll(){
    actualizarProgreso();
    actualizarNavActiva();
    backToTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', alHacerScroll, { passive: true });
  alHacerScroll();

});
