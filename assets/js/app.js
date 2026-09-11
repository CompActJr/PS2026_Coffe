(() => {
  const root = document.documentElement;

  const init = () => {
    const gsap = window.gsap;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /*
      Limpa os sublinhados provisórios que ficaram
      em alguns textos do portfólio exportado.
    */
    document
      .querySelectorAll(
        "#portfolio [data-layer]"
      )
      .forEach((element) => {
        if (
          element.childElementCount === 0
        ) {
          element.textContent =
            element.textContent
              .replace(
                /\s*_{2,}\s*/g,
                " "
              )
              .replace(
                /\s{2,}/g,
                " "
              )
              .trim();
        }
      });

    /*
      Se o GSAP não carregar ou o usuário tiver
      animações reduzidas ativadas, libera a página
      normalmente.
    */
    if (
      !gsap ||
      reducedMotion
    ) {
      root.classList.add(
        "animations-ready"
      );

      return;
    }

    const isMobile =
      window.matchMedia(
        "(max-width: 700px)"
      ).matches;

    const hasMouse =
      window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches;

    gsap.defaults({
      duration:
        isMobile
          ? 0.55
          : 0.72,

      ease:
        "power3.out"
    });

    const first = (
      selector,
      context = document
    ) =>
      context.querySelector(
        selector
      );

    const all = (
      selector,
      context = document
    ) =>
      Array.from(
        context.querySelectorAll(
          selector
        )
      );

    const unique = (
      items
    ) =>
      [
        ...new Set(
          items.filter(Boolean)
        )
      ];

    /*
      Prepara o estado inicial ANTES de liberar
      os elementos visualmente.
    */
    const prepare = (
      targets,
      vars = {}
    ) => {
      const elements =
        unique(
          Array.from(
            targets || []
          )
        );

      if (
        !elements.length
      ) {
        return elements;
      }

      gsap.set(
        elements,
        {
          autoAlpha: 0,

          y:
            isMobile
              ? 18
              : 28,

          force3D: true,

          ...vars
        }
      );

      return elements;
    };

    const clearAnimationProps = (
      elements
    ) => {
      if (
        !elements.length
      ) {
        return;
      }

      gsap.set(
        elements,
        {
          clearProps:
            "opacity,visibility,transform"
        }
      );
    };

    /*
      Revela um ou vários elementos.
    */
    const reveal = (
      targets,
      vars = {}
    ) => {
      const elements =
        unique(
          Array.from(
            targets || []
          )
        );

      if (
        !elements.length
      ) {
        return;
      }

      const userComplete =
        vars.onComplete;

      gsap.to(
        elements,
        {
          autoAlpha: 1,

          x: 0,

          y: 0,

          scale: 1,

          rotation: 0,

          duration:
            isMobile
              ? 0.55
              : 0.72,

          stagger:
            isMobile
              ? 0.07
              : 0.1,

          overwrite:
            "auto",

          ...vars,

          onComplete: () => {
            clearAnimationProps(
              elements
            );

            if (
              typeof userComplete ===
              "function"
            ) {
              userComplete();
            }
          }
        }
      );
    };

    /*
      IntersectionObserver para animar somente
      quando a seção entrar no campo de visão.
    */
    const observe = (
      trigger,
      targets,
      vars = {},
      options = {}
    ) => {
      const elements =
        unique(
          Array.from(
            targets || []
          )
        );

      if (
        !trigger ||
        !elements.length
      ) {
        return;
      }

      const observer =
        new IntersectionObserver(
          (
            entries,
            currentObserver
          ) => {
            entries.forEach(
              (entry) => {
                if (
                  !entry.isIntersecting
                ) {
                  return;
                }

                reveal(
                  elements,
                  vars
                );

                currentObserver
                  .unobserve(
                    entry.target
                  );
              }
            );
          },

          {
            threshold:
              options.threshold ??
              0.12,

            rootMargin:
              options.rootMargin ??
              "0px 0px -8% 0px"
          }
        );

      observer.observe(
        trigger
      );
    };

    /* =====================================================
       ELEMENTOS
       ===================================================== */

    const navbar =
      first(
        ".Navbar"
      );

    /* =====================================================
       HERO
       ===================================================== */

    const heroText =
      first(
        ".HeroSection > .Frame:first-child"
      );

    const heroImage =
      first(
        ".HeroSection > .Frame:last-child"
      );

    const heroBadge =
      heroImage
        ? first(
            ":scope > .Frame",
            heroImage
          )
        : null;

    /* =====================================================
       QUEM SOMOS
       ===================================================== */

    const quemSomos =
      first(
        "#quem-somos"
      );

    const quemSomosImage =
      quemSomos
        ? first(
            ":scope > .Frame > .Frame:first-child",
            quemSomos
          )
        : null;

    const quemSomosContent =
      quemSomos
        ? first(
            ":scope > .Frame > .Frame:last-child",
            quemSomos
          )
        : null;

    /* =====================================================
       SERVIÇOS
       ===================================================== */

    const servicos =
      first(
        "#servicos"
      );

    const servicosHeader =
      servicos
        ? first(
            ":scope > .Frame > .Frame:first-child",
            servicos
          )
        : null;

    const servicosCards =
      servicos
        ? all(
            ":scope > .Frame > .Frame:last-child > .Frame",
            servicos
          )
        : [];

    /* =====================================================
       PORTFÓLIO
       ===================================================== */

    const portfolio =
      first(
        "#portfolio"
      );

    const portfolioHeader =
      portfolio
        ? first(
            ":scope > .Frame > .Frame:first-child",
            portfolio
          )
        : null;

    const portfolioCards =
      portfolio
        ? all(
            ":scope > .Frame > .Frame:last-child > .Frame",
            portfolio
          )
        : [];

    /* =====================================================
       COFFEES
       ===================================================== */

    const coffees =
      first(
        "#coffees"
      ) ||
      first(
        "main > section:nth-of-type(4)"
      );

    const coffeesHeader =
      coffees
        ? first(
            ":scope > .Frame > .Frame:first-child",
            coffees
          )
        : null;

    const coffeeCards =
      coffees
        ? all(
            ":scope > .Frame > .Frame:nth-child(n + 2) > .Frame",
            coffees
          )
        : [];

    /* =====================================================
       COMO FUNCIONA
       ===================================================== */

    const comoFunciona =
      first(
        "#como-funciona"
      ) ||
      first(
        "main > section:nth-of-type(5)"
      );

    const comoHeader =
      comoFunciona
        ? first(
            ":scope > .Frame > .Frame:first-child",
            comoFunciona
          )
        : null;

    const passos =
      comoFunciona
        ? all(
            ":scope > .Frame > .Frame:last-child > .Frame",
            comoFunciona
          )
        : [];

    /* =====================================================
       DEPOIMENTOS
       ===================================================== */

    const depoimentos =
      first(
        "#depoimentos"
      ) ||
      first(
        "main > section:nth-of-type(6)"
      );

    const depoimentosHeader =
      depoimentos
        ? first(
            ":scope > .Frame > .Frame:first-child",
            depoimentos
          )
        : null;

    const depoimentoCards =
      depoimentos
        ? all(
            ":scope > .Frame > .Frame:nth-child(n + 2) > .Frame",
            depoimentos
          )
        : [];

    /* =====================================================
       DIFERENCIAIS
       ===================================================== */

    const diferenciais =
      first(
        "#diferenciais"
      );

    const diferenciaisItems =
      diferenciais
        ? all(
            ":scope > .Frame > .Frame",
            diferenciais
          )
        : [];

    /* =====================================================
       CONTATO
       ===================================================== */

    const contato =
      first(
        "#contato"
      );

    const contatoCard =
      contato
        ? first(
            ":scope > .Frame > .Frame:first-child",
            contato
          )
        : null;

    /* =====================================================
       FOOTER
       ===================================================== */

    const footer =
      first(
        ".footer"
      );

    const footerColumns =
      footer
        ? all(
            ":scope > .Frame > .Frame:first-child > .Frame",
            footer
          )
        : [];

    const footerBottom =
      footer
        ? first(
            ":scope > .Frame > .Frame:last-child",
            footer
          )
        : null;

    /* =====================================================
       ESTADOS INICIAIS
       ===================================================== */

    const preparedNavbar =
      prepare(
        [navbar],
        {
          y:
            isMobile
              ? -10
              : -16
        }
      );

    const preparedHeroText =
      prepare(
        [heroText],
        {
          y:
            isMobile
              ? 16
              : 24
        }
      );

    const preparedHeroImage =
      prepare(
        [heroImage],
        {
          y:
            isMobile
              ? 14
              : 20,

          scale:
            isMobile
              ? 0.99
              : 0.985
        }
      );

    const preparedHeroBadge =
      prepare(
        [heroBadge],
        {
          y: 12,

          scale: 0.96
        }
      );

    const preparedQuemImage =
      prepare(
        [quemSomosImage],

        isMobile
          ? {
              y: 22
            }
          : {
              x: -26,

              y: 0,

              scale: 0.99
            }
      );

    const preparedQuemContent =
      prepare(
        [quemSomosContent],

        isMobile
          ? {
              y: 22
            }
          : {
              x: 26,

              y: 0
            }
      );

    const preparedServicosHeader =
      prepare(
        [servicosHeader],
        {
          y: 22
        }
      );

    const preparedServicosCards =
      prepare(
        servicosCards,
        {
          y:
            isMobile
              ? 20
              : 32,

          scale: 0.985
        }
      );

    const preparedPortfolioHeader =
      prepare(
        [portfolioHeader],
        {
          y: 22
        }
      );

    const preparedPortfolioCards =
      prepare(
        portfolioCards,
        {
          y:
            isMobile
              ? 20
              : 30,

          scale: 0.988
        }
      );

    const preparedCoffeesHeader =
      prepare(
        [coffeesHeader],
        {
          y: 22
        }
      );

    const preparedCoffeeCards =
      prepare(
        coffeeCards,
        {
          y:
            isMobile
              ? 20
              : 30,

          scale: 0.988
        }
      );

    const preparedComoHeader =
      prepare(
        [comoHeader],
        {
          y: 22
        }
      );

    const preparedPassos =
      prepare(
        passos,
        {
          y:
            isMobile
              ? 20
              : 32,

          scale: 0.985
        }
      );

    const preparedDepoimentosHeader =
      prepare(
        [depoimentosHeader],
        {
          y: 22
        }
      );

    const preparedDepoimentos =
      prepare(
        depoimentoCards,
        {
          y:
            isMobile
              ? 20
              : 28,

          scale: 0.99
        }
      );

    const preparedDiferenciais =
      prepare(
        diferenciaisItems,
        {
          y:
            isMobile
              ? 20
              : 30
        }
      );

    const preparedContato =
      prepare(
        [contatoCard],
        {
          y:
            isMobile
              ? 20
              : 28,

          scale: 0.99
        }
      );

    const preparedFooterColumns =
      prepare(
        footerColumns,
        {
          y:
            isMobile
              ? 16
              : 24,

          scale: 0.99
        }
      );

    const preparedFooterBottom =
      prepare(
        [footerBottom],
        {
          y: 12
        }
      );

    root.classList.add(
      "animations-ready"
    );

    /* =====================================================
       ANIMAÇÃO INICIAL
       ===================================================== */

    const intro =
      gsap.timeline({
        defaults: {
          ease:
            "power3.out"
        }
      });

    if (
      preparedNavbar.length
    ) {
      intro.to(
        preparedNavbar,
        {
          autoAlpha: 1,

          y: 0,

          duration:
            isMobile
              ? 0.42
              : 0.55,

          onComplete: () =>
            clearAnimationProps(
              preparedNavbar
            )
        }
      );
    }

    if (
      preparedHeroText.length
    ) {
      intro.to(
        preparedHeroText,
        {
          autoAlpha: 1,

          y: 0,

          duration:
            isMobile
              ? 0.58
              : 0.76,

          onComplete: () =>
            clearAnimationProps(
              preparedHeroText
            )
        },

        isMobile
          ? "-=0.16"
          : "-=0.25"
      );
    }

    if (
      preparedHeroImage.length
    ) {
      intro.to(
        preparedHeroImage,
        {
          autoAlpha: 1,

          y: 0,

          scale: 1,

          duration:
            isMobile
              ? 0.68
              : 0.88,

          ease:
            "power3.out",

          onComplete: () =>
            clearAnimationProps(
              preparedHeroImage
            )
        },

        isMobile
          ? "-=0.25"
          : "-=0.4"
      );
    }

    if (
      preparedHeroBadge.length
    ) {
      intro.to(
        preparedHeroBadge,
        {
          autoAlpha: 1,

          y: 0,

          scale: 1,

          duration:
            isMobile
              ? 0.45
              : 0.56,

          ease:
            "back.out(1.22)",

          onComplete: () =>
            clearAnimationProps(
              preparedHeroBadge
            )
        },

        "-=0.3"
      );
    }

    /* =====================================================
       QUEM SOMOS
       ===================================================== */

    observe(
      quemSomos,

      [
        ...preparedQuemImage,
        ...preparedQuemContent
      ],

      {
        duration:
          isMobile
            ? 0.6
            : 0.8,

        stagger: 0.1
      }
    );

    /* =====================================================
       SERVIÇOS
       ===================================================== */

    observe(
      servicos,

      preparedServicosHeader,

      {
        duration:
          isMobile
            ? 0.5
            : 0.62,

        stagger: 0
      }
    );

    observe(
      servicosCards[0] ||
        servicos,

      preparedServicosCards,

      {
        stagger:
          isMobile
            ? 0.07
            : 0.1
      },

      {
        rootMargin:
          "0px 0px -5% 0px"
      }
    );

    /* =====================================================
       PORTFÓLIO
       ===================================================== */

    observe(
      portfolio,

      preparedPortfolioHeader,

      {
        duration:
          isMobile
            ? 0.5
            : 0.62,

        stagger: 0
      }
    );

    observe(
      portfolioCards[0] ||
        portfolio,

      preparedPortfolioCards,

      {
        stagger:
          isMobile
            ? 0.07
            : 0.1
      },

      {
        rootMargin:
          "0px 0px -5% 0px"
      }
    );

    /* =====================================================
       COFFEES
       ===================================================== */

    observe(
      coffees,

      preparedCoffeesHeader,

      {
        duration:
          isMobile
            ? 0.5
            : 0.62,

        stagger: 0
      }
    );

    observe(
      coffeeCards[0] ||
        coffees,

      preparedCoffeeCards,

      {
        stagger:
          isMobile
            ? 0.06
            : 0.09
      },

      {
        rootMargin:
          "0px 0px -5% 0px"
      }
    );

    /* =====================================================
       COMO FUNCIONA
       ===================================================== */

    observe(
      comoFunciona,

      preparedComoHeader,

      {
        duration:
          isMobile
            ? 0.5
            : 0.62,

        stagger: 0
      }
    );

    observe(
      passos[0] ||
        comoFunciona,

      preparedPassos,

      {
        stagger:
          isMobile
            ? 0.07
            : 0.11
      },

      {
        rootMargin:
          "0px 0px -5% 0px"
      }
    );

    /* =====================================================
       DEPOIMENTOS
       ===================================================== */

    observe(
      depoimentos,

      preparedDepoimentosHeader,

      {
        duration:
          isMobile
            ? 0.5
            : 0.62,

        stagger: 0
      }
    );

    observe(
      depoimentoCards[0] ||
        depoimentos,

      preparedDepoimentos,

      {
        stagger:
          isMobile
            ? 0.07
            : 0.1
      },

      {
        rootMargin:
          "0px 0px -5% 0px"
      }
    );

    /* =====================================================
       DIFERENCIAIS
       ===================================================== */

    observe(
      diferenciais,

      preparedDiferenciais,

      {
        duration:
          isMobile
            ? 0.6
            : 0.78,

        stagger:
          isMobile
            ? 0.08
            : 0.12
      }
    );

    /* =====================================================
       CONTATO
       ===================================================== */

    observe(
      contato,

      preparedContato,

      {
        duration:
          isMobile
            ? 0.62
            : 0.8,

        stagger: 0
      }
    );

    /* =====================================================
       FOOTER
       ===================================================== */

    observe(
      footer,

      [
        ...preparedFooterColumns,
        ...preparedFooterBottom
      ],

      {
        duration:
          isMobile
            ? 0.55
            : 0.72,

        stagger:
          isMobile
            ? 0.07
            : 0.1
      },

      {
        rootMargin:
          "0px 0px -2% 0px"
      }
    );

    /* =====================================================
       MICROINTERAÇÕES
       ===================================================== */

    if (
      hasMouse
    ) {
      const hoverCards =
        unique([
          ...all(
            "#servicos > .Frame > .Frame:last-child > .Frame > .Frame"
          ),

          ...portfolioCards,

          ...coffeeCards,

          ...passos,

          ...depoimentoCards
        ]);

      hoverCards.forEach(
        (card) => {
          const planIcon =
            first(
              ".PlanIcon",
              card
            );

          const image =
            first(
              "img",
              card
            );

          const quote =
            first(
              ".Quote",
              card
            );

          card.addEventListener(
            "mouseenter",
            () => {
              gsap.to(
                card,
                {
                  y: -5,

                  duration:
                    0.24,

                  ease:
                    "power2.out",

                  overwrite:
                    "auto"
                }
              );

              if (
                planIcon
              ) {
                gsap.to(
                  planIcon,
                  {
                    scale: 1.08,

                    rotation: 4,

                    duration:
                      0.26,

                    ease:
                      "power2.out",

                    overwrite:
                      "auto"
                  }
                );
              }

              if (
                image
              ) {
                gsap.to(
                  image,
                  {
                    scale: 1.025,

                    duration:
                      0.36,

                    ease:
                      "power2.out",

                    overwrite:
                      "auto"
                  }
                );
              }

              /*
                Nos depoimentos o ícone
                de aspas também reage.
              */
              if (
                quote
              ) {
                gsap.to(
                  quote,
                  {
                    scale: 1.08,

                    y: -2,

                    duration:
                      0.24,

                    ease:
                      "power2.out",

                    overwrite:
                      "auto"
                  }
                );
              }
            }
          );

          card.addEventListener(
            "mouseleave",
            () => {
              gsap.to(
                card,
                {
                  y: 0,

                  duration:
                    0.28,

                  ease:
                    "power2.out",

                  overwrite:
                    "auto"
                }
              );

              if (
                planIcon
              ) {
                gsap.to(
                  planIcon,
                  {
                    scale: 1,

                    rotation: 0,

                    duration:
                      0.28,

                    ease:
                      "power2.out",

                    overwrite:
                      "auto"
                  }
                );
              }

              if (
                image
              ) {
                gsap.to(
                  image,
                  {
                    scale: 1,

                    duration:
                      0.32,

                    ease:
                      "power2.out",

                    overwrite:
                      "auto"
                  }
                );
              }

              if (
                quote
              ) {
                gsap.to(
                  quote,
                  {
                    scale: 1,

                    y: 0,

                    duration:
                      0.26,

                    ease:
                      "power2.out",

                    overwrite:
                      "auto"
                  }
                );
              }
            }
          );
        }
      );

      /* ===================================================
         BOTÕES DO CTA
         =================================================== */

      all(
        ".cta-action"
      ).forEach(
        (button) => {
          const icon =
            first(
              "img",
              button
            );

          button.addEventListener(
            "mouseenter",
            () => {
              gsap.to(
                button,
                {
                  y: -3,

                  duration:
                    0.2,

                  ease:
                    "power2.out",

                  overwrite:
                    "auto"
                }
              );

              if (
                icon
              ) {
                gsap.to(
                  icon,
                  {
                    scale:
                      1.1,

                    duration:
                      0.22,

                    ease:
                      "back.out(1.6)",

                    overwrite:
                      "auto"
                  }
                );
              }
            }
          );

          button.addEventListener(
            "mouseleave",
            () => {
              gsap.to(
                button,
                {
                  y: 0,

                  duration:
                    0.24,

                  ease:
                    "power2.out",

                  overwrite:
                    "auto"
                }
              );

              if (
                icon
              ) {
                gsap.to(
                  icon,
                  {
                    scale: 1,

                    duration:
                      0.22,

                    ease:
                      "power2.out",

                    overwrite:
                      "auto"
                  }
                );
              }
            }
          );
        }
      );
    }
  };

  /* =====================================================
     INICIALIZAÇÃO
     ===================================================== */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }
})();