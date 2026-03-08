/**
 * parallax.js
 * Efecto parallax multi-sección, bidireccional, relativo al viewport.
 * Uso en blade: <section data-parallax> con hijos <div data-parallax-layer="0.2">
 */
export function initParallax() {
    const sections = document.querySelectorAll('[data-parallax]');
    if (!sections.length) return;

    let ticking = false;

    const update = () => {
        sections.forEach(section => {
            const rect   = section.getBoundingClientRect();
            const layers = section.querySelectorAll('[data-parallax-layer]');

            layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.parallaxLayer) || 0.2;
                // rect.top es 0 cuando la sección toca el tope del viewport.
                // Al bajar → negativo → fondo se desplaza menos que el contenido.
                // Al subir → positivo → efecto inverso → totalmente reversible.
                layer.style.transform = `translateY(${-rect.top * speed}px)`;
            });
        });
        ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update,   { passive: true });
    update();
}
