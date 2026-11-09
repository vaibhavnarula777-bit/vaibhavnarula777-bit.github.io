/* Scroll animation layer: reveals, drawing section lines, parallax doodles, interactive photos, and the dog. */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ---------- hand-drawn kid: falls down the right edge as you scroll, parachute opens when you stop ---------- */
  var ground = document.createElement('div'); ground.id = 'ground'; document.body.appendChild(ground);
  var kid = document.createElement('div'); kid.id = 'kid'; kid.className = 'chute'; kid.setAttribute('aria-hidden', 'true');
  kid.innerHTML = "<svg viewBox=\"0 0 140 204\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><defs><filter id=\"wob\" x=\"-12%\" y=\"-12%\" width=\"124%\" height=\"124%\"><feTurbulence type=\"fractalNoise\" baseFrequency=\".03\" numOctaves=\"2\" seed=\"7\" result=\"n\"/><feDisplacementMap in=\"SourceGraphic\" in2=\"n\" scale=\"3.5\"/></filter></defs><g filter=\"url(#wob)\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g class=\"pk pk-chute\"><path d=\"M6,74 C6,16 134,16 134,74 C121,63 109,63 102,74 C94,63 80,63 70,74 C60,63 46,63 38,74 C31,63 19,63 6,74 Z\" fill=\"#E9B824\" stroke=\"#1E2230\" stroke-width=\"3.4\"/>\n<path d=\"M38,74 C40,42 50,28 70,22 C90,28 100,42 102,74 C94,63 80,63 70,74 C60,63 46,63 38,74 Z\" fill=\"#E9902E\" stroke=\"#1E2230\" stroke-width=\"2.4\"/>\n<path d=\"M20,70 L55,127 M120,70 L85,127 M70,74 L70,92\" stroke=\"#1E2230\" stroke-width=\"1.8\" fill=\"none\"/><path d=\"M54,142 C44,136 50,128 56,127\" stroke=\"#1E2230\" stroke-width=\"9\" fill=\"none\"/><path d=\"M54,142 C44,136 50,128 56,127\" stroke=\"#2F4FA3\" stroke-width=\"5\" fill=\"none\"/><path d=\"M86,142 C96,136 90,128 84,127\" stroke=\"#1E2230\" stroke-width=\"9\" fill=\"none\"/><path d=\"M86,142 C96,136 90,128 84,127\" stroke=\"#2F4FA3\" stroke-width=\"5\" fill=\"none\"/><path d=\"M60,172 L56,190\" stroke=\"#1E2230\" stroke-width=\"9\" fill=\"none\"/><path d=\"M60,172 L56,190\" stroke=\"#FFF6E0\" stroke-width=\"5\" fill=\"none\"/><path d=\"M80,172 L84,190\" stroke=\"#1E2230\" stroke-width=\"9\" fill=\"none\"/><path d=\"M80,172 L84,190\" stroke=\"#FFF6E0\" stroke-width=\"5\" fill=\"none\"/><ellipse cx=\"54\" cy=\"194\" rx=\"10\" ry=\"5.5\" fill=\"#1E2230\"/><ellipse cx=\"86\" cy=\"194\" rx=\"10\" ry=\"5.5\" fill=\"#1E2230\"/><path d=\"M52,136 C52,129 88,129 88,136 L91,168 C91,175 49,175 49,168 Z\" fill=\"#2F4FA3\" stroke=\"#1E2230\" stroke-width=\"3.4\"/><circle cx=\"70\" cy=\"112\" r=\"20\" fill=\"#FFF6E0\" stroke=\"#1E2230\" stroke-width=\"3.4\"/><path d=\"M52,106 C52,86 88,84 88,106 C80,98 62,98 52,106 Z\" fill=\"#1E2230\"/><circle cx=\"62\" cy=\"114\" r=\"2.6\" fill=\"#1E2230\"/><circle cx=\"78\" cy=\"114\" r=\"2.6\" fill=\"#1E2230\"/><path d=\"M63,122 C67,127 73,127 77,122\" fill=\"none\" stroke=\"#1E2230\" stroke-width=\"2.4\"/><circle cx=\"55\" cy=\"121\" r=\"3.4\" fill=\"#E9902E\" opacity=\".6\"/><circle cx=\"85\" cy=\"121\" r=\"3.4\" fill=\"#E9902E\" opacity=\".6\"/></g><g class=\"pk pk-fall\"><path d=\"M52,142 L28,116\" stroke=\"#1E2230\" stroke-width=\"9\" fill=\"none\"/><path d=\"M52,142 L28,116\" stroke=\"#2F4FA3\" stroke-width=\"5\" fill=\"none\"/><path d=\"M88,142 L114,114\" stroke=\"#1E2230\" stroke-width=\"9\" fill=\"none\"/><path d=\"M88,142 L114,114\" stroke=\"#2F4FA3\" stroke-width=\"5\" fill=\"none\"/><path d=\"M60,172 L44,192\" stroke=\"#1E2230\" stroke-width=\"9\" fill=\"none\"/><path d=\"M60,172 L44,192\" stroke=\"#FFF6E0\" stroke-width=\"5\" fill=\"none\"/><path d=\"M80,172 L100,190\" stroke=\"#1E2230\" stroke-width=\"9\" fill=\"none\"/><path d=\"M80,172 L100,190\" stroke=\"#FFF6E0\" stroke-width=\"5\" fill=\"none\"/><ellipse cx=\"40\" cy=\"195\" rx=\"10\" ry=\"5.5\" fill=\"#1E2230\"/><ellipse cx=\"104\" cy=\"194\" rx=\"10\" ry=\"5.5\" fill=\"#1E2230\"/><path d=\"M52,136 C52,129 88,129 88,136 L91,168 C91,175 49,175 49,168 Z\" fill=\"#2F4FA3\" stroke=\"#1E2230\" stroke-width=\"3.4\"/><circle cx=\"70\" cy=\"112\" r=\"20\" fill=\"#FFF6E0\" stroke=\"#1E2230\" stroke-width=\"3.4\"/><path d=\"M52,104 C46,86 56,74 62,70 C62,80 68,84 70,76 C72,84 80,80 82,70 C90,76 94,90 88,104 C80,96 62,96 52,104 Z\" fill=\"#1E2230\"/><circle cx=\"62\" cy=\"114\" r=\"3.2\" fill=\"#1E2230\"/><circle cx=\"78\" cy=\"114\" r=\"3.2\" fill=\"#1E2230\"/><ellipse cx=\"70\" cy=\"124\" rx=\"4\" ry=\"5.5\" fill=\"#1E2230\"/><circle cx=\"55\" cy=\"121\" r=\"3.4\" fill=\"#E9902E\" opacity=\".6\"/><circle cx=\"85\" cy=\"121\" r=\"3.4\" fill=\"#E9902E\" opacity=\".6\"/></g><g class=\"pk pk-land\"><path d=\"M52,142 L42,168\" stroke=\"#1E2230\" stroke-width=\"9\" fill=\"none\"/><path d=\"M52,142 L42,168\" stroke=\"#2F4FA3\" stroke-width=\"5\" fill=\"none\"/><g class=\"wave\"><path d=\"M88,142 L110,122\" stroke=\"#1E2230\" stroke-width=\"9\" fill=\"none\"/><path d=\"M88,142 L110,122\" stroke=\"#2F4FA3\" stroke-width=\"5\" fill=\"none\"/></g><path d=\"M60,172 L58,192\" stroke=\"#1E2230\" stroke-width=\"9\" fill=\"none\"/><path d=\"M60,172 L58,192\" stroke=\"#FFF6E0\" stroke-width=\"5\" fill=\"none\"/><path d=\"M80,172 L82,192\" stroke=\"#1E2230\" stroke-width=\"9\" fill=\"none\"/><path d=\"M80,172 L82,192\" stroke=\"#FFF6E0\" stroke-width=\"5\" fill=\"none\"/><ellipse cx=\"55\" cy=\"196\" rx=\"10\" ry=\"5.5\" fill=\"#1E2230\"/><ellipse cx=\"85\" cy=\"196\" rx=\"10\" ry=\"5.5\" fill=\"#1E2230\"/><path d=\"M52,136 C52,129 88,129 88,136 L91,168 C91,175 49,175 49,168 Z\" fill=\"#2F4FA3\" stroke=\"#1E2230\" stroke-width=\"3.4\"/><circle cx=\"70\" cy=\"112\" r=\"20\" fill=\"#FFF6E0\" stroke=\"#1E2230\" stroke-width=\"3.4\"/><path d=\"M52,106 C52,86 88,84 88,106 C80,98 62,98 52,106 Z\" fill=\"#1E2230\"/><circle cx=\"62\" cy=\"114\" r=\"2.6\" fill=\"#1E2230\"/><circle cx=\"78\" cy=\"114\" r=\"2.6\" fill=\"#1E2230\"/><path d=\"M63,122 C67,127 73,127 77,122\" fill=\"none\" stroke=\"#1E2230\" stroke-width=\"2.4\"/><circle cx=\"55\" cy=\"121\" r=\"3.4\" fill=\"#E9902E\" opacity=\".6\"/><circle cx=\"85\" cy=\"121\" r=\"3.4\" fill=\"#E9902E\" opacity=\".6\"/></g></g></svg>";
  document.body.appendChild(kid);
  var lastY = window.scrollY, lastMove = 0;
  function place(){
    var y = window.scrollY, vw = window.innerWidth, vh = window.innerHeight;
    var h = document.documentElement.scrollHeight - vh, p = h > 0 ? Math.min(1, y / h) : 0;
    var s = vw < 600 ? .62 : 1, kh = 153 * s;
    var dY = y - lastY; if (dY !== 0) lastMove = Date.now();
    lastY = y;
    var moving = Date.now() - lastMove < 240;
    var landed = p > .985 && !moving;
    var top = 78 + p * Math.max(0, vh - kh - 78 - 26);
    if (landed) top = vh - kh - 14;
    var rot = moving ? 26 * Math.sin(y / 80) + (dY > 0 ? 6 : -6) : 0;
    kid.className = landed ? 'land' : (moving ? 'fall' : 'chute');
    ground.style.opacity = p > .97 ? 1 : 0;
    kid.style.transform = 'translateY(' + top + 'px) rotate(' + rot + 'deg) scale(' + s + ')';
  }
  if (reduce){
    kid.className = 'land';
    kid.style.transform = 'translateY(' + (window.innerHeight - 170) + 'px) scale(.8)';
  } else {
    window.addEventListener('scroll', place, {passive: true});
    window.addEventListener('resize', place);
    place();
    setInterval(function(){ var d = Date.now() - lastMove; if (d >= 240 && d < 400) place(); }, 120);
  }

  if (reduce || !('IntersectionObserver' in window)) return;
  root.classList.add('anim');

  /* ---------- photos: tilt toward the mouse, click to bring one to the front ---------- */
  var ph = document.getElementById('photos');
  if (ph){
    var pols = [].slice.call(ph.querySelectorAll('.pol'));
    ph.addEventListener('mousemove', function(e){
      var r = ph.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
      pols.forEach(function(p, i){
        var k = i ? 1 : -1;
        p.style.setProperty('--tx', (dx * 22 * k).toFixed(1));
        p.style.setProperty('--ty', (dy * 18 * k).toFixed(1));
      });
    });
    ph.addEventListener('mouseleave', function(){ pols.forEach(function(p){ p.style.setProperty('--tx', 0); p.style.setProperty('--ty', 0); }); });
    pols.forEach(function(p){
      function lift(){ pols.forEach(function(q){ q.classList.toggle('top', q === p); }); }
      p.addEventListener('click', lift);
      p.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ lift(); e.preventDefault(); } });
    });
  }

  /* reveal on enter, with a small stagger for siblings */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold: .15, rootMargin: '0px 0px -6% 0px'});
  document.querySelectorAll('.reveal,.pop,.sec-line,.pol').forEach(function(n,i){ io.observe(n); });
  document.querySelectorAll('.stats .stat').forEach(function(n,i){ n.classList.add('reveal'); n.style.setProperty('--d', (i % 3) * .12 + 's'); io.observe(n); });

  /* about text lights up word by word as you scroll */
  var h = document.getElementById('aboutline');
  if (h){
    var words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map(function(w){ return '<span class="w">' + w + '</span>'; }).join(' ');
    var spans = [].slice.call(h.querySelectorAll('.w'));
    var lightUp = function(){
      var r = h.getBoundingClientRect(), vh = window.innerHeight;
      var p = (vh * .86 - r.top) / (vh * .5 + r.height * .6);
      p = Math.max(0, Math.min(1, p));
      var n = Math.round(p * spans.length);
      spans.forEach(function(s, i){ s.classList.toggle('lit', i < n); });
    };
    window.addEventListener('scroll', lightUp, {passive: true});
    window.addEventListener('resize', lightUp);
    lightUp();
  }

  /* parallax: doodles drift, hero map lags, paper sheet straightens */
  var doodles = [].slice.call(document.querySelectorAll('.doodle'));
  var map = document.getElementById('mapcard');
  var hint = document.getElementById('hint');
  var ticking = false;
  function frame(){
    ticking = false;
    var y = window.scrollY;
    doodles.forEach(function(d, i){
      var sp = +d.dataset.speed || 0;
      d.style.transform = 'translateY(' + (y * sp) + 'px) rotate(' + (y * (i % 2 ? .05 : -.07)) + 'deg)';
    });
    if (map && y < 1200) map.style.transform = 'translateY(' + (y * .12) + 'px) rotate(' + (y * .004) + 'deg)';
    if (hint) hint.style.opacity = Math.max(0, 1 - y / 220);
  }
  window.addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(frame); } }, {passive: true});
  frame();
})();
