/* Hero background: drifting photographs + light particles + cursor parallax */
(function () {
  const canvas = document.getElementById('bg');
  if (!window.THREE) return;
  const mobile = innerWidth < 800;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.055);
  const cam = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  cam.position.z = 8;

  const loader = new THREE.TextureLoader(); loader.crossOrigin = 'anonymous';
  const planes = [];
  const n = mobile ? 6 : 10;
  for (let i = 0; i < n; i++) {
    const w = 1.6 + Math.random() * .8, h = w * 1.3;
    const mat = new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0, side: THREE.DoubleSide, fog: true });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    const a = (i / n) * Math.PI * 2;
    m.position.set(Math.cos(a) * (4 + Math.random() * 2.5), (Math.random() - .5) * 6, -Math.random() * 10 - 1);
    m.rotation.set((Math.random() - .5) * .3, (Math.random() - .5) * .6, (Math.random() - .5) * .2);
    m.userData = { s: .15 + Math.random() * .25, o: Math.random() * 6, y: m.position.y, r: m.rotation.y };
    scene.add(m); planes.push(m);
    loader.load(window.IMGS[i % window.IMGS.length], t => {
      t.encoding = THREE.sRGBEncoding; mat.map = t; mat.color.set(0xbbbbbb); mat.needsUpdate = true;
      gsap.to(mat, { opacity: .85, duration: 1.6, delay: i * .12 });
    });
  }

  const pc = mobile ? 250 : 700, pos = new Float32Array(pc * 3);
  for (let i = 0; i < pc; i++) { pos[i * 3] = (Math.random() - .5) * 26; pos[i * 3 + 1] = (Math.random() - .5) * 16; pos[i * 3 + 2] = -Math.random() * 16 + 4; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xd4af37, size: .04, transparent: true, opacity: .7, depthWrite: false }));
  scene.add(pts);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }, ray = new THREE.Raycaster(), v2 = new THREE.Vector2();
  addEventListener('pointermove', e => { mouse.tx = e.clientX / innerWidth - .5; mouse.ty = e.clientY / innerHeight - .5; v2.set(mouse.tx * 2, -mouse.ty * 2); });

  const resize = () => { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.position.z = innerWidth < 800 ? 10 : 8; cam.updateProjectionMatrix(); };
  addEventListener('resize', resize); resize();

  let scroll = 0, run = true;
  addEventListener('scroll', () => { scroll = scrollY; }, { passive: true });
  document.addEventListener('visibilitychange', () => { run = !document.hidden; if (run) tick(); });

  const clock = new THREE.Clock();
  function tick() {
    if (!run) return;
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    mouse.x += (mouse.tx - mouse.x) * .04; mouse.y += (mouse.ty - mouse.y) * .04;
    cam.position.x = mouse.x * 1.6 + Math.sin(t * .1) * .4;
    cam.position.y = -mouse.y * 1.0 - scroll * .0009 + Math.cos(t * .12) * .25;
    cam.lookAt(0, -scroll * .0006, -3);
    ray.setFromCamera(v2, cam);
    const hit = ray.intersectObjects(planes)[0];
    planes.forEach(p => {
      const d = p.userData;
      p.position.y = d.y + Math.sin(t * d.s + d.o) * .5;
      p.rotation.y = d.r + Math.sin(t * d.s * .7 + d.o) * .12 + (hit && hit.object === p ? .25 : 0);
      p.scale.setScalar(THREE.MathUtils.lerp(p.scale.x, hit && hit.object === p ? 1.1 : 1, .08));
    });
    pts.rotation.y = t * .015; pts.position.y = Math.sin(t * .2) * .2;
    renderer.render(scene, cam);
  }
  tick();
  /* fade the scene as user leaves the hero so content stays readable */
  window.heroScene = { fade: o => { canvas.style.opacity = o; } };
})();
