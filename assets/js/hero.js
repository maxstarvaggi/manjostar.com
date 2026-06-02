(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var ctx    = canvas.getContext('2d');
  var nodes  = [];
  var mouse  = { x: -9999, y: -9999 };
  var raf;

  var mobile     = window.matchMedia('(max-width: 768px)').matches;
  var COUNT      = mobile ? 35 : 72;
  var MAX_DIST   = mobile ? 110 : 155;
  var SPEED      = 0.38;
  var MOUSE_RAD  = 130;

  /* ---------- setup ---------- */

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function makeNode() {
    var angle = Math.random() * Math.PI * 2;
    var speed = SPEED * (0.4 + Math.random() * 0.6);
    return {
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r:  Math.random() * 1.3 + 0.7
    };
  }

  function init() {
    resize();
    nodes = [];
    for (var i = 0; i < COUNT; i++) nodes.push(makeNode());
  }

  /* ---------- frame ---------- */

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* move nodes */
    for (var i = 0; i < nodes.length; i++) {
      var n  = nodes[i];
      var mx = n.x - mouse.x;
      var my = n.y - mouse.y;
      var md = Math.sqrt(mx * mx + my * my);

      if (md < MOUSE_RAD && md > 0.5) {
        var f = (MOUSE_RAD - md) / MOUSE_RAD;
        n.x  += (mx / md) * f * 2.2;
        n.y  += (my / md) * f * 2.2;
      }

      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0)             { n.x = 0;             n.vx = Math.abs(n.vx); }
      if (n.x > canvas.width)  { n.x = canvas.width;  n.vx = -Math.abs(n.vx); }
      if (n.y < 0)             { n.y = 0;             n.vy = Math.abs(n.vy); }
      if (n.y > canvas.height) { n.y = canvas.height; n.vy = -Math.abs(n.vy); }
    }

    /* draw edges */
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.globalAlpha = (1 - d / MAX_DIST) * 0.2;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth   = 0.75;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    /* draw nodes */
    ctx.globalAlpha = 0.45;
    ctx.fillStyle   = '#ffffff';
    for (var i = 0; i < nodes.length; i++) {
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(step);
  }

  /* ---------- events ---------- */

  /* Mouse tracking on the section so pointer-events:none on canvas still works */
  var section = canvas.parentElement;

  section.addEventListener('mousemove', function (e) {
    var r  = section.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  section.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener('resize', function () {
    cancelAnimationFrame(raf);
    mobile    = window.matchMedia('(max-width: 768px)').matches;
    COUNT     = mobile ? 35 : 72;
    MAX_DIST  = mobile ? 110 : 155;
    init();
    step();
  });

  /* ---------- go ---------- */
  init();
  step();
})();
