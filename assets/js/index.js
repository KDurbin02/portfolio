(function() {
  var H, Particle, W, animate, animationLoop, canvas, colors, ctx, damping_constant, density, display_list, draw, init, last_time, min_distance, num_particles, spring_constant, text_array, update, frame, profile, toggle;

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();

  canvas = null;
  ctx = null;
  num_particles = 400;
  density = 8;
  min_distance = 70;
  text_array = [];
  last_time = null;
  spring_constant = 0; //0.2;
  damping_constant = 1; //0.08;

  colors = ['#cccccc', '#ffffff', '#bbbbbb', '#999999'];

  onResize = function() {
    cancelAnimationFrame(frame);
    W = document.body.clientWidth;
    H = document.body.clientHeight;
    canvas.width = W;
    canvas.height = H;
    _results = [];
    display_list = [];
    for (i = _i = 0; 0 <= num_particles ? _i < num_particles : _i > num_particles; i = 0 <= num_particles ? ++_i : --_i) {
      _results.push(display_list.push(new Particle));
    }
    animate();
  };

  onScroll = function() {
    if (!toggle && window.scrollY > 0) {
      profile.className = 'logo nav__logo small';
      toggle = !toggle;
    }else if (window.scrollY <= 0) {
      profile.className = 'logo nav__logo';
      toggle = !toggle;
    }
  };

  init = function(e) {
    var i, _i, _results;
    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');
    onResize();
    profile = document.getElementById('photo');
    window.addEventListener('resize', onResize);
    if (profile) window.addEventListener('scroll', onScroll);
  };

  animate = function() {
    animationLoop();
    return frame = requestAnimFrame(animate);
  };

  animationLoop = function() {
    draw();
    return update();
  };

  draw = function() {
    var child, _i, _len, _results;
    ctx.clearRect(0, 0, W, H);
    _results = [];
    for (_i = 0, _len = display_list.length; _i < _len; _i++) {
      child = display_list[_i];
      if (typeof child.draw !== 'function') {
        continue;
      }
      ctx.save();
      if (!isNaN(child.x || isNaN(child.y))) {
        ctx.translate(child.x, child.y);
      }
      if (!isNaN(child.scale_x || isNaN(child.scale_y))) {
        ctx.scale(child.scale_x, child.scale_y);
      }
      if (!isNaN(child.alpha)) {
        ctx.globalAlpha = child.alpha;
      }
      child.draw();
      _results.push(ctx.restore());
    }
    return _results;
  };

  update = function() {
    var child, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = display_list.length; _i < _len; _i++) {
      child = display_list[_i];
      if (typeof child.update === 'function') {
        _results.push(child.update());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Particle = (function() {
    function Particle(radius, x, y) {
      this.radius = radius != null ? radius : 1;
      this.x = x != null ? x : Math.random() * W;
      this.y = y != null ? y : Math.random() * H;
      this.speed_x = 10 - Math.random() * 20;
      this.speed_y = 10 - Math.random() * 20;
      this.ox = this.x;
      this.oy = this.y;
      this.color = "#ff0";
      this.alpha = 1;
      this.reset();
    }

    Particle.prototype.draw = function() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(4, 4, 4, 0, Math.PI * 2, true);
      return ctx.fill();
    };

    Particle.prototype.update = function() {
      var acc_x, acc_y;
      acc_x = -spring_constant * (this.x - this.ox) - damping_constant * this.speed_x;
      acc_y = -spring_constant * (this.y - this.oy) - damping_constant * this.speed_y;
      this.speed_x += acc_x;
      this.speed_y += acc_y;
      this.alpha -= 0.008;
      this.scale_x += 0.008;
      this.scale_y += 0.008;
      this.x += this.speed_x;
      this.y += this.speed_y;
      if (this.alpha <= 0) {
        return this.reset();
      }
    };

    Particle.prototype.reset = function() {
      this.alpha = Math.random();
      this.scale_x = this.scale_y = Math.random();
      return this.color = colors[~~(Math.random() * colors.length)];
    };

    Particle.prototype.reposition = function() {
      var point;
      point = text_array[~~(Math.random() * text_array.length)];
      this.ox = this.x = point.x + ~~(3 + Math.random() * 6);
      return this.oy = this.y = point.y + ~~(3 + Math.random() * 6);
    };

    return Particle;

  })();

  init();

}).call(this);
