(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }
    

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
  */
   (() => {
      const sections = [...document.querySelectorAll('main section[id]')];
      const links = [...document.querySelectorAll('.navmenu a[href^="#"]')];

      const topOffset = 12; // small buffer
      let currentId = null;

      const setActive = (id) => {
        if (!id || id === currentId) return;
        currentId = id;
        links.forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
        );
      };

      const getCurrentSection = () => {
        // Focus line ~40% from viewport top
        const focusY = window.scrollY + window.innerHeight * 0.4;

        if (window.scrollY < 150) return 'initial'; // keep Home active at top

        for (const s of sections) {
          const top = s.offsetTop;
          const bottom = top + s.offsetHeight;
          if (focusY >= top && focusY < bottom) return s.id;
        }
        return sections.at(-1)?.id || null;
      };

      const onScroll = () => setActive(getCurrentSection());
      window.addEventListener('load', onScroll);
      document.addEventListener('scroll', onScroll, { passive: true });

      // Smooth scroll with offset
      links.forEach(a => {
        a.addEventListener('click', (e) => {
          const id = a.getAttribute('href').slice(1);
          const el = document.getElementById(id);
          if (!el) return;
          e.preventDefault();
          const y = el.getBoundingClientRect().top + window.scrollY - topOffset + 1;
          window.scrollTo({ top: y, behavior: 'smooth' });
        });
      });

      window.addEventListener('load', () => {
        const hash = location.hash?.slice(1);
        if (hash && document.getElementById(hash)) setActive(hash);
        else onScroll();
      });
    })();

/**
  * Halo Background
  */

window.addEventListener("DOMContentLoaded", () => {
  if (typeof VANTA !== 'undefined' && VANTA.HALO) {
    VANTA.HALO({
      el: "#initial-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      backgroundColor: 0x040b14,
      baseColor: 0x1a59,
      size: 1,
      amplitudeFactor: 1,
      xOffset: 0,
      yOffset: 0
    });
  }
});
})();

/**
   * Theme Toggle (Light/Dark with localStorage)
*/
  (function setupThemeToggle() {
    const root = document.documentElement;
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    // Load saved theme (default = light)
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      root.setAttribute('data-theme', saved);
      updateIcon(saved);
    } else {
      // Optional: respect system preference on first visit
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'light';
      root.setAttribute('data-theme', initial);
      updateIcon(initial);
    }

    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon(next);
    });

    function updateIcon(theme) {
      const i = btn.querySelector('i');
      if (!i) return;
      // moon icon when we are in light (click to go dark), sun icon when in dark (click to go light)
      i.classList.toggle('bi-moon', theme !== 'dark');
      i.classList.toggle('bi-sun', theme === 'dark');
    }
  })();

  /**
   * Project Population
*/
document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('projectModal');
  if (!modalEl) return;

  const titleEl     = modalEl.querySelector('#projectModalLabel');
  const descEl      = modalEl.querySelector('#projectDescription');
  const githubBtn   = modalEl.querySelector('#githubLink');
  //const videoWrap   = modalEl.querySelector('#videoContainer');
  //const videoIframe = modalEl.querySelector('#projectVideo');

  // Populate when the modal is about to show
  modalEl.addEventListener('show.bs.modal', (evt) => {
    // The element that triggered the modal (your <a class="project-link">)
    const trigger = evt.relatedTarget;
    if (!trigger) return;

    const { title, description, github, video } = trigger.dataset;

    titleEl.textContent = title || 'Project';
    descEl.textContent  = description || '';

    // GitHub button
    if (github) {
      githubBtn.href = github;
      githubBtn.closest('.text-center').style.display = '';
    } else {
      githubBtn.closest('.text-center').style.display = 'none';
    }

  });
});
