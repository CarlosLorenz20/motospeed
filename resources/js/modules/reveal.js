/**
 * reveal.js
 * Anima elementos al entrar en el viewport usando IntersectionObserver.
 * Uso en blade: <div data-reveal> o <div data-reveal data-reveal-delay="200">
 * El CSS correspondiente está en app.css ([data-reveal] / [data-reveal].revealed)
 */
export function initReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay;
                if (delay) {
                    setTimeout(() => entry.target.classList.add('revealed'), parseInt(delay));
                } else {
                    entry.target.classList.add('revealed');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.10 });

    elements.forEach(el => observer.observe(el));
}
