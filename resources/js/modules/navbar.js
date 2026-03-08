/**
 * navbar.js
 * Controla la navbar pública:
 *   - Menú móvil (hamburguesa): #mobile-menu-toggle / #mobile-menu
 *   - Dropdown de usuario: [data-dropdown-container]
 */

export function initMobileMenu() {
    const toggle    = document.getElementById('mobile-menu-toggle');
    const menu      = document.getElementById('mobile-menu');
    const iconOpen  = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isHidden = menu.classList.contains('hidden');
        menu.classList.toggle('hidden', !isHidden);
        iconOpen?.classList.toggle('hidden',  !isHidden);
        iconClose?.classList.toggle('hidden', isHidden);
    });
}

export function initDropdowns() {
    document.querySelectorAll('[data-dropdown-container]').forEach(container => {
        const toggle  = container.querySelector('[data-dropdown-toggle]');
        const menu    = container.querySelector('[data-dropdown-menu]');
        const chevron = container.querySelector('[data-dropdown-chevron]');
        if (!toggle || !menu) return;

        const open = () => {
            menu.classList.remove('hidden');
            chevron?.classList.add('rotate-180');
        };
        const close = () => {
            menu.classList.add('hidden');
            chevron?.classList.remove('rotate-180');
        };

        toggle.addEventListener('click', e => {
            e.stopPropagation();
            menu.classList.contains('hidden') ? open() : close();
        });

        // Cerrar al hacer click fuera del dropdown
        document.addEventListener('click', e => {
            if (!container.contains(e.target)) close();
        });

        // Cerrar con tecla Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') close();
        });
    });
}
