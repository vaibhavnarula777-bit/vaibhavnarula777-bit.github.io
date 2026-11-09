/* UI layer: hero map, project tabs and filter, nav tracking, paper pager, copy button.
   Model logic lives in widgets.js (loaded first). NC and C are globals from the other scripts. */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- hero map: counties draw in, hover names them ---------- */
  var hm = document.getElementById('heromap');
  var nameEl = document.getElementById('mapname'), popEl = document.getElementById('mappop');
  var home = null;
  NC.counties.forEach(function(c){
    var p = el('path', {d: c.d, 'class': 'cty'}, hm);
    p.dataset.id = c.id;
    if (c.n === 'Wake') { home = p; p.classList.add('on'); }
    var show = function(){
      document.querySelectorAll('#heromap .on').forEach(function(x){ x.classList.remove('on'); });
      p.classList.add('on');
      nameEl.textContent = c.n + ' County' + (c.n === 'Wake' ? ' ★ home' : '');
      popEl.textContent = fmt(c.pop) + ' people';
    };
    p.addEventListener('mouseenter', show);
    p.addEventListener('focus', show);
    p.addEventListener('click', show);
  });
  var out = el('path', {d: NC.outline, 'class': 'out'}, hm);
  if (!reduce && out.getTotalLength) {
    var L = out.getTotalLength();
    out.style.strokeDasharray = L;
    out.style.strokeDashoffset = L;
    out.getBoundingClientRect();
    out.style.transition = 'stroke-dashoffset 2.2s ease-out .2s';
    requestAnimationFrame(function(){ out.style.strokeDashoffset = 0; });
  }
  // home star marker
  var wake = NC.counties.filter(function(c){ return c.n === 'Wake'; })[0];
  if (wake) {
    var s = el('path', {d: 'M0,-9 L2.6,-2.8 9,-2.8 3.8,1.2 5.8,7.6 0,3.8 -5.8,7.6 -3.8,1.2 -9,-2.8 -2.6,-2.8Z',
      fill: '#E9B824', stroke: '#1E2230', 'stroke-width': 1.2, transform: 'translate(' + wake.x + ',' + wake.y + ')', 'pointer-events': 'none'}, hm);
  }
  document.getElementById('mapcard').addEventListener('mouseleave', function(){
    document.querySelectorAll('#heromap .on').forEach(function(x){ x.classList.remove('on'); });
    if (home) home.classList.add('on');
    nameEl.textContent = 'Wake County ★ home';
    popEl.textContent = fmt(wake.pop) + ' people';
  });

  /* ---------- project tabs ---------- */
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  var sheets = {};
  document.querySelectorAll('.panel').forEach(function(s){ sheets[s.id.replace('sheet-', '')] = s; });
  function pick(key){
    tabs.forEach(function(c){ c.setAttribute('aria-selected', c.dataset.sheet === key ? 'true' : 'false'); });
    Object.keys(sheets).forEach(function(k){ sheets[k].hidden = (k !== key); });
    if (key === 'rural' && typeof drawRural === 'function') drawRural();
    if (key === 'bridge' && typeof drawBridge === 'function') drawBridge(false);
  }
  tabs.forEach(function(c){ c.addEventListener('click', function(){ pick(c.dataset.sheet); }); });
  pick('snap');

  /* ---------- nav: progress line + current section ---------- */
  var bar = document.getElementById('bar');
  var links = [].slice.call(document.querySelectorAll('.bar nav a'));
  var secs = ['about', 'projects', 'contact'].map(function(id){ return document.getElementById(id); });
  function onScroll(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--p', (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + '%');
    var cur = null, y = window.scrollY + 120;
    secs.forEach(function(s){ if (s && s.offsetTop <= y) cur = s.id; });
    links.forEach(function(a){ a.classList.toggle('on', a.dataset.s === cur); });
  }
  window.addEventListener('scroll', onScroll, {passive: true});
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- paper pagers ---------- */
  function pager(o){
    var page = 1, N = o.n;
    var img = document.getElementById(o.img), slide = document.getElementById(o.slide);
    var prev = document.getElementById(o.prev), next = document.getElementById(o.next), count = document.getElementById(o.count);
    var box = document.getElementById(o.box);
    function pad(n){ return (n < 10 ? '0' : '') + n; }
    function src(n){ return o.path.replace('##', pad(n)); }
    function go(n){
      page = Math.max(1, Math.min(N, n));
      img.src = src(page);
      img.alt = 'Page ' + page + ' of the ' + o.name + ' paper';
      slide.value = page;
      count.textContent = page + ' / ' + N;
      prev.disabled = page === 1;
      next.disabled = page === N;
      if (page < N) { var pre = new Image(); pre.src = src(page + 1); }
    }
    prev.addEventListener('click', function(){ go(page - 1); });
    next.addEventListener('click', function(){ go(page + 1); });
    slide.addEventListener('input', function(){ go(+slide.value); });
    box.tabIndex = 0;
    box.setAttribute('aria-label', 'Paper page. Use left and right arrow keys to turn pages.');
    box.addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight') { go(page + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { go(page - 1); e.preventDefault(); }
    });
    box.addEventListener('click', function(e){
      var r = box.getBoundingClientRect();
      go(e.clientX < r.left + r.width / 2 ? page - 1 : page + 1);
    });
    go(1);
  }
  pager({n:21, img:'pageimg', slide:'pageslide', prev:'prev', next:'next', count:'pcount', box:'pagebox', path:'p-##.png', name:'SNAPGraph NC'});
  pager({n:3, img:'sripimg', slide:'sripslide', prev:'sripprev', next:'sripnext', count:'sripcount', box:'sripbox', path:'srip-##.png', name:'SRIP'});

  /* ---------- copy address ---------- */
  var copy = document.getElementById('copy'), msg = document.getElementById('copied'), mail = document.getElementById('mail');
  copy.addEventListener('click', function(){
    var t = mail.textContent.trim();
    function done(){ msg.textContent = 'copied!'; setTimeout(function(){ msg.textContent = ''; }, 1800); }
    function fallback(){
      var r = document.createRange(); r.selectNodeContents(mail);
      var s = getSelection(); s.removeAllRanges(); s.addRange(r);
      msg.textContent = 'selected, press copy';
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fallback);
    else fallback();
  });
})();
