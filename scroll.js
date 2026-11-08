/* Scroll animation layer: reveals, drawing section lines, word-by-word about text, parallax doodles. */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (reduce || !('IntersectionObserver' in window)) return;
  root.classList.add('anim');

  /* reveal on enter, with a small stagger for siblings */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold: .15, rootMargin: '0px 0px -6% 0px'});
  document.querySelectorAll('.reveal,.pop,.sec-line').forEach(function(n,i){ io.observe(n); });
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
