(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  const header = $('.site-header');
  const headerInner = $('.header-inner');
  const menuToggle = $('.menu-toggle');
  const mobileMenu = $('#mobile-menu');

  /* =====================================================
     NAVEGAÇÃO / MENU GLASS
     ===================================================== */

  const setMenuState = (open, immediate = false) => {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');

    const links = $$('a', mobileMenu);

    if (!gsap || reducedMotion || immediate) {
      if (gsap && immediate) {
        gsap.killTweensOf([mobileMenu, ...links]);
        gsap.set([mobileMenu, ...links], { clearProps: 'opacity,visibility,transform' });
      }
      mobileMenu.classList.toggle('is-open', open);
      return;
    }

    gsap.killTweensOf([mobileMenu, ...links]);

    if (open) {
      mobileMenu.classList.add('is-open');

      gsap.set(mobileMenu, {
        autoAlpha: 0,
        xPercent: -50,
        y: -12,
        scale: 0.985,
        transformOrigin: '50% 0%'
      });

      gsap.to(mobileMenu, {
        autoAlpha: 1,
        xPercent: -50,
        y: 0,
        scale: 1,
        duration: 0.28,
        ease: 'power3.out'
      });

      gsap.fromTo(
        links,
        { autoAlpha: 0, x: 12 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.045,
          ease: 'power3.out',
          delay: 0.06,
          clearProps: 'opacity,visibility,transform'
        }
      );
    } else {
      gsap.to(mobileMenu, {
        autoAlpha: 0,
        xPercent: -50,
        y: -10,
        scale: 0.985,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          mobileMenu.classList.remove('is-open');
          gsap.set(mobileMenu, { clearProps: 'opacity,visibility,transform' });
        }
      });
    }
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenuState(!isOpen);
    });

    $$('a', mobileMenu).forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuState(false);
    });

    document.addEventListener('click', (event) => {
      if (!mobileMenu.classList.contains('is-open')) return;
      if (mobileMenu.contains(event.target) || menuToggle.contains(event.target)) return;
      setMenuState(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) setMenuState(false, true);
    }, { passive: true });
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* =====================================================
     LINK ATIVO + SCROLL SUAVE
     ===================================================== */

  const desktopNavLinks = $$('.desktop-nav a[href^="#"]');
  const mobileNavLinks = $$('.mobile-menu a[href^="#"]:not(.mobile-menu-cta)');
  const allNavLinks = [...desktopNavLinks, ...mobileNavLinks];

  const sectionIds = [...new Set(
    allNavLinks
      .map((link) => link.getAttribute('href'))
      .filter(Boolean)
  )];

  const sections = sectionIds
    .map((id) => $(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      allNavLinks.forEach((link) => {
        link.classList.toggle(
          'is-active',
          link.getAttribute('href') === `#${visible.target.id}`
        );
      });
    }, {
      rootMargin: '-30% 0px -56% 0px',
      threshold: [0.05, 0.18, 0.45]
    });

    sections.forEach((section) => activeObserver.observe(section));
  }

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = $(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });

  /* =====================================================
     GSAP — INTRO, SCROLL, PARALLAX E MICROINTERAÇÕES
     ===================================================== */

  if (gsap && !reducedMotion) {
    gsap.defaults({ ease: 'power3.out' });

    const heroCopy = $('[data-hero-copy]');
    const heroVisual = $('[data-hero-visual]');
    const heroStamp = $('[data-hero-stamp]');
    const heroPhoto = $('.hero-photo-wrap img');

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (headerInner) {
      intro.fromTo(
        headerInner,
        { autoAlpha: 0, y: -24, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, clearProps: 'opacity,visibility,transform' }
      );
    }

    if (heroCopy) {
      const heroPieces = [
        $('.eyebrow', heroCopy),
        $('h1', heroCopy),
        $('.hero-lead', heroCopy),
        $('.hero-buttons', heroCopy)
      ].filter(Boolean);

      intro.fromTo(
        heroPieces,
        { autoAlpha: 0, y: 28, filter: 'blur(7px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.095,
          clearProps: 'opacity,visibility,transform,filter'
        },
        '-=0.34'
      );
    }

    if (heroVisual) {
      intro.fromTo(
        heroVisual,
        {
          autoAlpha: 0,
          y: 30,
          scale: 0.965,
          clipPath: 'inset(8% 3% 8% 3% round 40px)'
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0% round 38px)',
          duration: 1.05,
          ease: 'power4.out',
          clearProps: 'opacity,visibility,transform,clipPath'
        },
        '-=0.48'
      );
    }

    if (heroPhoto) {
      intro.fromTo(
        heroPhoto,
        { scale: 1.09 },
        { scale: 1.012, duration: 1.25, ease: 'power3.out' },
        '-=1.0'
      );
    }

    if (heroStamp) {
      intro.fromTo(
        heroStamp,
        { autoAlpha: 0, y: 10, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.52,
          ease: 'power3.out',
          clearProps: 'opacity,visibility,transform'
        },
        '-=0.40'
      );
    }

    const animateWithFallback = (trigger, targets, fromVars, toVars = {}) => {
      const elements = (Array.isArray(targets) ? targets : [targets]).filter(Boolean);
      if (!trigger || !elements.length) return;

      const finalVars = {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        filter: 'blur(0px)',
        duration: 0.74,
        stagger: 0.09,
        ease: 'power3.out',
        clearProps: 'opacity,visibility,transform,filter',
        ...toVars
      };

      gsap.set(elements, { autoAlpha: 0, ...fromVars });

      if (ScrollTrigger) {
        gsap.to(elements, {
          ...finalVars,
          scrollTrigger: {
            trigger,
            start: 'top 84%',
            once: true
          }
        });
        return;
      }

      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          gsap.to(elements, finalVars);
          currentObserver.unobserve(entry.target);
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
      });

      observer.observe(trigger);
    };

    $$('[data-reveal]').forEach((element) => {
      if (element.classList.contains('section-heading')) {
        const pieces = [
          $('.eyebrow', element),
          $('.section-title', element),
          $('.section-text', element)
        ].filter(Boolean);

        animateWithFallback(
          element,
          pieces,
          { y: 30, filter: 'blur(7px)' },
          { stagger: 0.095, duration: 0.72 }
        );
        return;
      }

      if (element.classList.contains('about-photo')) {
        animateWithFallback(
          element,
          element,
          {
            x: -34,
            scale: 0.975,
            clipPath: 'inset(0 12% 0 0 round 32px)'
          },
          {
            duration: 0.92,
            clipPath: 'inset(0 0% 0 0 round 32px)',
            clearProps: 'opacity,visibility,transform,filter,clipPath'
          }
        );
        return;
      }

      const from = element.classList.contains('reveal-left')
        ? { x: -30, y: 0, filter: 'blur(5px)' }
        : element.classList.contains('reveal-right')
          ? { x: 30, y: 0, filter: 'blur(5px)' }
          : { y: 28, filter: 'blur(5px)' };

      animateWithFallback(element, element, from, { stagger: 0 });
    });

    $$('[data-stagger-group]').forEach((group) => {
      const items = $$('[data-stagger-item]', group);

      animateWithFallback(
        group,
        items,
        {
          y: 38,
          scale: 0.975,
          rotationX: 4,
          transformPerspective: 900,
          transformOrigin: '50% 100%'
        },
        {
          duration: 0.72,
          stagger: 0.085
        }
      );
    });

    if (ScrollTrigger) {
      const impactPanel = $('.impact-panel');
      if (impactPanel) {
        const tags = $$('.impact-tag', impactPanel);
        if (tags.length) {
          gsap.fromTo(
            tags,
            { autoAlpha: 0, y: 18, scale: 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: 'back.out(1.25)',
              scrollTrigger: {
                trigger: tags[0],
                start: 'top 88%',
                once: true
              },
              clearProps: 'opacity,visibility,transform'
            }
          );
        }
      }

      const contactLinks = $$('.contact-link');
      if (contactLinks.length) {
        gsap.fromTo(
          contactLinks,
          { autoAlpha: 0, x: 28 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.58,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.contact-actions',
              start: 'top 86%',
              once: true
            },
            clearProps: 'opacity,visibility,transform'
          }
        );
      }

      const footerPieces = [$('.footer-brand-block'), $('.footer-contact'), $('.footer-bottom')].filter(Boolean);
      if (footerPieces.length) {
        gsap.fromTo(
          footerPieces,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            scrollTrigger: {
              trigger: '.site-footer',
              start: 'top 94%',
              once: true
            },
            clearProps: 'opacity,visibility,transform'
          }
        );
      }
    }

    /* Cards com inclinação 3D discreta no desktop. */
    if (finePointer) {
      const tiltCards = $$('.service-card, .portfolio-card, .plan-card, .testimonial-card, .mini-card');

      tiltCards.forEach((card) => {
        const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.34, ease: 'power3.out' });
        const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.34, ease: 'power3.out' });
        const moveY = gsap.quickTo(card, 'y', { duration: 0.28, ease: 'power3.out' });

        card.addEventListener('mousemove', (event) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;

          rotateY(px * 4.5);
          rotateX(py * -4.5);
          moveY(-4);
        });

        card.addEventListener('mouseleave', () => {
          rotateX(0);
          rotateY(0);
          moveY(0);
        });
      });

      /* Botões levemente magnéticos sem alterar o layout. */
      $$('.btn').forEach((button) => {
        const moveX = gsap.quickTo(button, 'x', { duration: 0.28, ease: 'power3.out' });
        const moveY = gsap.quickTo(button, 'y', { duration: 0.28, ease: 'power3.out' });

        button.addEventListener('mousemove', (event) => {
          const rect = button.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;
          moveX(x * 0.08);
          moveY(y * 0.10 - 2);
        });

        button.addEventListener('mouseleave', () => {
          moveX(0);
          moveY(0);
        });
      });
    }
  }

  /* Mantém os cálculos de ScrollTrigger alinhados após imagens e fontes terminarem de carregar. */
  if (ScrollTrigger) {
    window.addEventListener('load', () => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, { once: true });
  }

})();
