/* Preloader, nav, form, boot */
(function () {
  document.getElementById('yr').textContent = new Date().getFullYear();
  document.body.style.overflow = 'hidden';

  const pre = document.getElementById('pre');
  const rings = pre.querySelectorAll('.rings i');
  let done = false;
  const finish = () => {
    if (done) return; done = true;
    document.body.style.overflow = '';
    pre.remove();
    initAnimations();
    ScrollTrigger.refresh();
  };

  const tl = gsap.timeline({ onComplete: finish });
  tl.from('#pre span', { opacity: 0, letterSpacing: '1.2em', duration: .8, ease: 'power3.out' })
    .to(rings, { opacity: 1, scale: 1, duration: .01 }, 0)
    .fromTo(rings, { scale: 1, opacity: .9 }, { scale: 14, opacity: 0, duration: 1.2, stagger: .15, ease: 'power2.out' }, 0.1)
    .to('#pre span', { opacity: 0, duration: .3 }, '-=.5')
    .fromTo(pre, { clipPath: 'circle(150% at 50% 50%)' }, { clipPath: 'circle(0% at 50% 50%)', duration: .7, ease: 'power3.inOut', immediateRender: false }, '-=.2')
    .add(() => { heroIntro(); }, '-=.5');
  setTimeout(finish, 4500); /* safety net */

  /* Nav: hide on scroll down, show on up */
  const nav = document.querySelector('.nav');
  let last = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.style.transform = y > last && y > 200 ? 'translateY(-110%)' : 'none';
    nav.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1)';
    last = y;
  }, { passive: true });

  /* Smooth anchor scrolling that respects ScrollTrigger */
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t || a.getAttribute('href') === '#') return;
    e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' });
  }));

  /* Contact form (client-side validation; wire to your endpoint) */
  const form = document.getElementById('form'), msg = document.getElementById('msg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const ok = d.get('n').trim() && /^\S+@\S+\.\S+$/.test(d.get('e')) && d.get('m').trim();
    msg.textContent = ok ? `Thank you, ${d.get('n').trim().split(' ')[0]}. We will reply within 24 hours.` : 'Please add your name, a valid email and a message.';
    if (ok) { form.reset(); gsap.from(msg, { opacity: 0, y: 10, duration: .6 }); }
  });
})();
