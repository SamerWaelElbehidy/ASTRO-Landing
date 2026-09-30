(function () {
  /* ------------------------------------------------------------ language */
  const T = {
    'store.eyebrow': ['ASTRO Store', 'متجر ASTRO'],
    'store.title': ['Everything you need to build', 'كل ما تحتاجه لتبني مشروعك'],
    'store.desc': ['Electronic components, sensors, motors and modules — ready for your next project.', 'مكونات إلكترونية وحساسات ومحركات ووحدات — جاهزة لمشروعك القادم.'],
    'store.t1': ['Components', 'مكونات'], 'store.t2': ['Sensors', 'حساسات'], 'store.t3': ['Motors', 'محركات'], 'store.t4': ['3D printing', 'طباعة ثلاثية الأبعاد'], 'store.t5': ['Laser cutting', 'قص ليزر'],
    'store.cta': ['Shop components', 'تسوّق المكونات'],
    'proj.eyebrow': ['ASTRO Projects', 'مشاريع ASTRO'],
    'proj.title': ['See what we build', 'شاهد ما نصنعه'],
    'proj.desc': ['Robotics, embedded, IoT and AI projects — explore them, or drive through them in a 3D world.', 'مشاريع روبوتات وأنظمة مدمجة وإنترنت الأشياء وذكاء اصطناعي — تصفّحها أو تجوّل بينها بسيارتك في عالم ثلاثي الأبعاد.'],
    'proj.t1': ['Robotics', 'روبوتات'], 'proj.t2': ['Embedded', 'أنظمة مدمجة'], 'proj.t3': ['IoT', 'إنترنت الأشياء'], 'proj.t4': ['AI', 'ذكاء اصطناعي'], 'proj.t5': ['3D world', 'عالم ثلاثي الأبعاد'],
    'proj.cta': ['Explore projects', 'استكشف المشاريع'],
    'foot.loc': ['New Damietta, Egypt', 'دمياط الجديدة، مصر'], 'foot.wa': ['WhatsApp', 'واتساب']
  };
  let lang = 'en'; try { lang = localStorage.getItem('astro-landing-lang') || (/^ar/i.test(navigator.language) ? 'ar' : 'en'); } catch (e) {}
  function apply() {
    const h = document.documentElement; h.lang = lang; h.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-t]').forEach((n) => { const e = T[n.dataset.t]; if (e) n.textContent = e[lang === 'ar' ? 1 : 0]; });
    document.getElementById('lang').textContent = lang === 'ar' ? 'English' : 'عربي';
    document.title = lang === 'ar' ? 'ASTRO — حلول تقنية ذكية' : 'ASTRO — Smart Technology Solutions';
    // In RTL the first half sits on the right, so the seam and hover order stay natural.
  }
  document.getElementById('lang').addEventListener('click', () => { lang = lang === 'ar' ? 'en' : 'ar'; try { localStorage.setItem('astro-landing-lang', lang); } catch (e) {} apply(); });
  apply();

  /* ------------------------------------------------------------ seeded rng */
  let seed = 4242; const rnd = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); Object.keys(attrs).forEach((k) => n.setAttribute(k, attrs[k])); if (parent) parent.appendChild(n); return n; };

  /* ------------------------------------------------------------ PCB traces (store) */
  (function pcb() {
    const svg = document.getElementById('art-pcb'), W = 800, H = 1000; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    // a few chips
    [[120, 220, 120, 90], [520, 640, 150, 110], [300, 820, 100, 70]].forEach(([x, y, w, h]) => {
      mk('rect', { class: 'chip', x, y, width: w, height: h, rx: 6 }, svg);
      for (let i = 0; i < 6; i++) { const px = x + 12 + i * ((w - 24) / 5); mk('path', { class: 'trace solid', d: `M${px} ${y}v-14M${px} ${y + h}v14` }, svg); }
    });
    for (let i = 0; i < 30; i++) {
      let x = Math.round(rnd() * W / 20) * 20, y = Math.round(rnd() * H / 20) * 20, d = `M${x} ${y}`;
      const segs = 3 + ((rnd() * 3) | 0);
      for (let s = 0; s < segs; s++) {
        const len = (2 + ((rnd() * 7) | 0)) * 20, horiz = rnd() > 0.5, sign = rnd() > 0.5 ? 1 : -1;
        if (horiz) { x += sign * len; d += `H${x}`; } else { y += sign * len; d += `V${y}`; }
        if (rnd() > 0.55) { const dg = 20 * (rnd() > 0.5 ? 1 : -1); x += dg; y += dg; d += `L${x} ${y}`; }
      }
      const solid = rnd() > 0.6;
      const p = mk('path', { class: 'trace' + (solid ? ' solid' : ''), d }, svg);
      if (!solid) p.style.animationDuration = (5 + rnd() * 9).toFixed(1) + 's';
      mk('circle', { class: 'pad', cx: x, cy: y, r: 5 }, svg);
    }
  })();

  /* ------------------------------------------------------------ world pins (projects) */
  (function pins() {
    const cols = ['#ff5d7a', '#9b7bff', '#33d6ff', '#3ddc97', '#9be15d', '#ff9f43', '#ffd23f', '#4d8bff', '#ff6bd6'];
    const box = document.getElementById('pins');
    cols.forEach((c, i) => {
      const a = (i / cols.length) * Math.PI * 2 + 0.4, r = 0.24 + (i % 3) * 0.08;
      const el = document.createElement('i'); el.className = 'pin';
      el.style.setProperty('--c', c); el.style.left = (50 + Math.cos(a) * r * 100 * 0.9).toFixed(1) + '%'; el.style.top = (48 + Math.sin(a) * r * 100 * 0.75).toFixed(1) + '%';
      el.style.animationDelay = (-i * 0.45).toFixed(2) + 's'; el.style.transform = 'translateY(0)';
      box.appendChild(el);
    });
  })();
})();
