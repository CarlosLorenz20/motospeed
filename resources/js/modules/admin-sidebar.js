/**
 * admin-sidebar.js
 * Sidebar del panel de administración en móvil.
 *   - #sidebar-toggle  → botón hamburguesa (visible solo en móvil)
 *   - #sidebar         → el aside lateral
 *   - #sidebar-overlay → fondo oscuro que cierra el sidebar al hacer click
 */
export function initAdminSidebar() {
    const btn     = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!btn || !sidebar) return;

    const open  = () => {
        sidebar.classList.remove('-translate-x-full');
        overlay?.classList.remove('hidden');
    };
    const close = () => {
        sidebar.classList.add('-translate-x-full');
        overlay?.classList.add('hidden');
    };

    btn.addEventListener('click', () => {
        sidebar.classList.contains('-translate-x-full') ? open() : close();
    });

    overlay?.addEventListener('click', close);
}
