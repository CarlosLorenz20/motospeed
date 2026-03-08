/**
 * skeleton.js
 * Muestra placeholders skeleton mientras carga el contenido real.
 * Uso en blade:
 *   <div data-skeleton-wrapper="600">        ← delay en ms
 *     <div data-skeleton>...</div>            ← placeholders (desaparecen)
 *     <div data-skeleton-content>...</div>    ← contenido real (aparece)
 *   </div>
 */
export function initSkeletons() {
    const wrappers = document.querySelectorAll('[data-skeleton-wrapper]');
    wrappers.forEach(wrapper => {
        const skeleton = wrapper.querySelector('[data-skeleton]');
        const real     = wrapper.querySelector('[data-skeleton-content]');
        if (!skeleton || !real) return;

        const delay = parseInt(wrapper.dataset.skeletonWrapper) || 300;
        setTimeout(() => {
            skeleton.classList.add('skeleton-done');
            real.classList.remove('opacity-0');
            real.classList.add('opacity-100');
        }, delay);
    });
}
