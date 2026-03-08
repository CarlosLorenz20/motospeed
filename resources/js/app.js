import './bootstrap';
import 'preline';

import { initParallax }                  from './modules/parallax.js';
import { initReveal }                    from './modules/reveal.js';
import { initSkeletons }                 from './modules/skeleton.js';
import { initFeaturedCarousel }          from './modules/carousel3d.js';
import { initMobileMenu, initDropdowns } from './modules/navbar.js';
import { initAdminSidebar }              from './modules/admin-sidebar.js';

document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initReveal();
    initSkeletons();
    initFeaturedCarousel();
    initAdminSidebar();
    initDropdowns();
    initMobileMenu();
});
