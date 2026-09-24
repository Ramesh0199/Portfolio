/* GSAP scroll + hover animations */
gsap.registerPlugin(ScrollTrigger);

window.initAnimations = function () {
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rm) return;

  /* Reveal on scroll */
  gsap.utils.toArray('[data-r]').forEach(el => {
    const left = el.dataset.r === 'left';
    gsap.from(el, { opacity: 0, y: left ? 0 : 50, x: left ? -80 : 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  /* Stagger service/quote cards */
  ['.grid3', '.stats'].forEach(s => document.querySelectorAll(s).forEach(g => {
    gsap.from(g.children, { opacity: 0, y: 60, stagger: .1, duration: 1, ease: 'power3.out', immediateRender: false,
      scrollTrigger: { trigger: g, start: 'top 85%', once: true } });
  }));

  /* Parallax */
  gsap.utils.toArray('[data-p]').forEach(el => {
    gsap.to(el, { yPercent: +el.dataset.p, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* Hero fades as you scroll into content */
  ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: s => window.heroScene && heroScene.fade(1 - s.progress * .75) });
  gsap.to('.hero h1', { y: -80, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* Timeline */
  gsap.fromTo('.line', { scaleY: 0 }, { scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: true } });
  gsap.utils.toArray('.timeline li').forEach(li => {
    gsap.from(li, { opacity: 0, x: 40, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 85%', once: true } });
  });

  /* Counters */
  document.querySelectorAll('[data-n]').forEach(el => {
    const o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () =>
      gsap.to(o, { v: +el.dataset.n, duration: 2.2, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v); } }) });
  });

  /* Card tilt + glow (fine pointers only) */
  if (matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.tilt').forEach(c => {
      const rx = gsap.quickTo(c, 'rotationX', { duration: .5, ease: 'power3' });
      const ry = gsap.quickTo(c, 'rotationY', { duration: .5, ease: 'power3' });
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        ry((x - .5) * 14); rx((.5 - y) * 14);
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
      });
      c.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }
};

window.heroIntro = function () {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('.hero .eyebrow', { opacity: 0, y: 20, duration: .8 })
    .from('.hero h1 em', { yPercent: 110, duration: 1.3, stagger: .12 }, '-=.5')
    .from('.hero .sub', { opacity: 0, y: 24, duration: 1 }, '-=.8')
    .from('.hero .btn', { opacity: 0, y: 24, duration: .9, stagger: .1 }, '-=.8')
    .from('.nav', { opacity: 0, y: -30, duration: 1 }, '-=1');
};
