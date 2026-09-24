/* Data, projects, testimonials, masonry gallery, filters, lightbox */
(function () {
  const u = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

  const ITEMS = [
    { id: '1509631179647-0177331693ae', c: 'Fashion', t: 'Noir Atelier', h: 1.35 },
    { id: '1515886657613-9f3515b0c78f', c: 'Fashion', t: 'Silk & Shadow', h: 1.5 },
    { id: '1523275335684-37898b6baf30', c: 'Product', t: 'Chronos Watch', h: 1 },
    { id: '1519741497674-611481863552', c: 'Wedding', t: 'Villa Serena', h: 1.4 },
    { id: '1496747611176-843222e1e57c', c: 'Editorial', t: 'Vogue Étude', h: 1.3 },
    { id: '1542291026-7eec264c27ff', c: 'Product', t: 'Velocity One', h: 0.9 },
    { id: '1511285560929-80b456fea0bc', c: 'Wedding', t: 'Golden Vows', h: 1.2 },
    { id: '1529626455594-4ff0802cfb7e', c: 'Editorial', t: 'Quiet Portraits', h: 1.45 },
    { id: '1490481651871-ab68de25d43d', c: 'Fashion', t: 'Autumn Line', h: 1.25 },
    { id: '1524504388940-b1c1722653e1', c: 'Commercial', t: 'Maison Beauty', h: 1.3 },
    { id: '1503341455253-b2e723bb3dbb', c: 'Commercial', t: 'Urban Motion', h: 1.1 }
  ];
  const CATS = ['All', 'Fashion', 'Commercial', 'Product', 'Wedding', 'Editorial'];

  window.IMGS = ITEMS.map(i => u(i.id, 900));

  const PROJECTS = [
    { i: 0, c: 'Fashion Campaign', t: 'Noir Atelier — AW Collection', d: 'A monochrome campaign shot across three days in Milan, blending studio precision with street-level grit.' },
    { i: 9, c: 'Commercial', t: 'Maison Beauty — Radiance', d: 'Global launch imagery for a luxury skincare line, from concept through retouching and rollout.' },
    { i: 2, c: 'Product', t: 'Chronos — Timeless Series', d: 'Macro-lit still life for a heritage watchmaker, built to hold up on billboards and packaging alike.' }
  ];
  const QUOTES = [
    { p: '1494790108377-be9c29b29330', n: 'Elena Marchetti', co: 'Creative Director, Noir Atelier', q: 'Lumen understood our brand before we finished the brief. The campaign redefined our season.' },
    { p: '1500648767791-00dcc994a43e', n: 'Daniel Okafor', co: 'Head of Marketing, Chronos', q: 'Exacting, calm and endlessly inventive. Our product has never looked this good.' },
    { p: '1507003211169-0a1dd7228f2d', n: 'James & Sofia Hale', co: 'Wedding Clients', q: 'We forgot the camera was there, then cried at every single frame. Truly art.' }
  ];

  const $ = s => document.querySelector(s);
  const fb = 'onerror="this.style.minHeight=\'200px\'"';

  $('#projects').innerHTML = PROJECTS.map(p => `
    <article class="proj" data-r>
      <div class="pi"><img loading="lazy" src="${u(ITEMS[p.i].id, 1400)}" alt="${p.t}" ${fb}></div>
      <div class="pt"><small>${p.c}</small><h3>${p.t}</h3><p>${p.d}</p><a href="#portfolio" class="btn">View Project</a></div>
    </article>`).join('');

  $('#quotes').innerHTML = QUOTES.map(q => `
    <article class="card quote tilt" data-r>
      <q>“${q.q}”</q>
      <footer><img loading="lazy" src="${u(q.p, 120)}" alt="${q.n}"><div><b>${q.n}</b><small>${q.co}</small></div></footer>
    </article>`).join('');

  const G = $('#gallery');
  G.innerHTML = ITEMS.map((it, k) => `
    <figure class="it" data-c="${it.c}" data-k="${k}" tabindex="0">
      <img loading="lazy" width="600" height="${Math.round(600 * it.h)}" src="${u(it.id, 700)}" alt="${it.t}" ${fb}>
      <div class="ov"><small>${it.c}</small><b>${it.t}</b></div>
    </figure>`).join('');

  $('#filters').innerHTML = CATS.map((c, i) => `<button class="${i ? '' : 'on'}" data-f="${c}">${c}</button>`).join('');
  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    document.querySelectorAll('#filters button').forEach(x => x.classList.toggle('on', x === b));
    const f = b.dataset.f, all = [...G.children];
    const show = all.filter(el => f === 'All' || el.dataset.c === f);
    gsap.to(all, { opacity: 0, scale: .94, duration: .25, onComplete() {
      all.forEach(el => el.style.display = show.includes(el) ? '' : 'none');
      gsap.fromTo(show, { opacity: 0, y: 30, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .6, stagger: .05, ease: 'power3.out' });
      ScrollTrigger.refresh();
    } });
  });

  /* Lightbox */
  const lb = $('#lb'), im = lb.querySelector('img'), cap = lb.querySelector('figcaption');
  let cur = 0, vis = [];
  const open = k => {
    cur = k; const it = ITEMS[k];
    im.src = u(it.id, 1800); im.alt = it.t; cap.textContent = `${it.t} — ${it.c}`;
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    gsap.fromTo(lb.querySelector('figure'), { opacity: 0, scale: .94 }, { opacity: 1, scale: 1, duration: .5, ease: 'power3.out' });
    document.body.style.overflow = 'hidden';
  };
  const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
  const step = d => {
    vis = [...G.children].filter(e => e.style.display !== 'none').map(e => +e.dataset.k);
    open(vis[(vis.indexOf(cur) + d + vis.length) % vis.length]);
  };
  G.addEventListener('click', e => { const f = e.target.closest('.it'); if (f) open(+f.dataset.k); });
  G.addEventListener('keydown', e => { if (e.key === 'Enter') { const f = e.target.closest('.it'); if (f) open(+f.dataset.k); } });
  lb.querySelector('.x').onclick = close;
  lb.querySelector('.pv').onclick = () => step(-1);
  lb.querySelector('.nx').onclick = () => step(1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1);
  });
})();
