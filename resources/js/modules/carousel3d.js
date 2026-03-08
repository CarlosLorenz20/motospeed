/**
 * carousel3d.js
 * Carrusel 3D automático para la sección de productos destacados.
 *
 * HTML requerido (home/index.blade.php):
 *   #carousel-3d-wrap   → contenedor externo (perspectiva)
 *   #carousel-3d-track  → pista con .carousel-slide hijos
 *   #carousel-prev      → botón anterior
 *   #carousel-next      → botón siguiente
 *   #carousel-dots      → contenedor de dots (se construye dinámicamente)
 *
 * Comportamiento:
 *   - Card central: frontal, tamaño completo
 *   - Cards ±1: desplazadas lateralmente, rotadas ~38°, escala 82%
 *   - Cards ±2: más alejadas, rotadas ~62°, semitransparentes
 *   - Avance automático cada 5 s, pausa en hover
 *   - Swipe táctil en móvil
 *   - Click en card lateral → pasa al centro
 */
export function initFeaturedCarousel() {
    const wrap    = document.getElementById('carousel-3d-wrap');
    const track   = document.getElementById('carousel-3d-track');
    const dotsEl  = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (!wrap || !track) return;

    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    if (!slides.length) return;

    let current     = 0;
    let autoTimer   = null;
    let touchStartX = 0;
    const total     = slides.length;

    // Separación horizontal entre cards según breakpoint
    const gap = () => window.innerWidth < 640 ? 155 : 245;

    const positionSlides = () => {
        const g = gap();
        slides.forEach((slide, i) => {
            let off = i - current;
            // Normalizar para carrusel circular
            if (off >  total / 2) off -= total;
            if (off < -total / 2) off += total;

            const abs  = Math.abs(off);
            const sign = off === 0 ? 0 : off / abs;

            let tx, ry, sc, op, zi, shadow;

            if (abs === 0) {
                tx = 0;              ry = 0;           sc = 1;    op = 1;    zi = 10;
                shadow = '0 28px 64px rgba(0,0,0,0.22)';
            } else if (abs === 1) {
                tx = sign * g;       ry = -sign * 38;  sc = 0.82; op = 0.88; zi = 7;
                shadow = '0 8px 24px rgba(0,0,0,0.13)';
            } else if (abs === 2) {
                tx = sign * g * 1.7; ry = -sign * 62;  sc = 0.62; op = 0.38; zi = 4;
                shadow = 'none';
            } else {
                tx = sign * 9999;    ry = -sign * 90;  sc = 0.3;  op = 0;    zi = 0;
                shadow = 'none';
            }

            // translateX primero (mueve la card lateralmente en el plano de pantalla),
            // luego rotateY (gira localmente alrededor de su propio eje Y)
            slide.style.transform  = `translateX(${tx}px) rotateY(${ry}deg) scale(${sc})`;
            slide.style.opacity    = op;
            slide.style.zIndex     = zi;
            slide.style.boxShadow  = shadow;
            slide.style.cursor     = abs === 0 ? 'default' : 'pointer';
            slide.dataset.slideIndex = i;
        });
        updateDots();
    };

    const updateDots = () => {
        if (!dotsEl) return;
        dotsEl.querySelectorAll('button').forEach((btn, i) => {
            btn.className = i === current
                ? 'h-2.5 w-5   rounded-full bg-red-600 transition-all duration-300'
                : 'h-2.5 w-2.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-all duration-300';
        });
    };

    const buildDots = () => {
        if (!dotsEl) return;
        dotsEl.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.dotIndex = i;
            btn.setAttribute('aria-label', `Producto ${i + 1}`);
            dotsEl.appendChild(btn);
        }
        updateDots();
    };

    const goTo = (index) => {
        current = ((index % total) + total) % total;
        positionSlides();
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    const stopAuto  = () => { clearInterval(autoTimer); autoTimer = null; };
    const startAuto = () => { stopAuto(); autoTimer = setInterval(next, 5000); };

    prevBtn?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    nextBtn?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

    // Click en card lateral → ir directamente a ese slide
    track.addEventListener('click', e => {
        const slide = e.target.closest('.carousel-slide');
        if (!slide) return;
        const idx = parseInt(slide.dataset.slideIndex);
        if (idx !== current) { stopAuto(); goTo(idx); startAuto(); }
    });

    dotsEl?.addEventListener('click', e => {
        const btn = e.target.closest('[data-dot-index]');
        if (!btn) return;
        stopAuto(); goTo(parseInt(btn.dataset.dotIndex)); startAuto();
    });

    // Pausa al hacer hover
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);

    // Swipe táctil
    wrap.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend',   e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
    }, { passive: true });

    // Recalcular al cambiar tamaño de ventana
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(positionSlides, 150);
    }, { passive: true });

    buildDots();
    positionSlides();
    startAuto();
}
