window.customImage.loading = 0;
window.customImage.globalDebug = false;
function customImage(img) {
  if (img == undefined) img = {}
  if (typeof img == 'string') img = { src: img }
  let self = new Image();
  let scale = img.scale != undefined ? img.scale : 1.0;
  self.scaleX = img.scaleX != undefined ? img.scaleX : scale;
  self.scaleY = img.scaleY != undefined ? img.scaleY : scale;
  self.px = img.px != undefined ? img.px : 0;
  self.py = img.py != undefined ? img.py : 0;
  self.bx = img.bx != undefined ? img.bx : 0;
  self.by = img.by != undefined ? img.by : 0;
  self.clipX = img.clipX != undefined ? img.clipX : 0;
  self.clipY = img.clipY != undefined ? img.clipY : 0;
  self.clipW = img.clipW != undefined ? img.clipW : 0;
  self.clipH = img.clipH != undefined ? img.clipH : 0;
  self.text = img.text != undefined ? img.text : '';
  self.textX = img.textX != undefined ? img.textX : 0;
  self.textY = img.textY != undefined ? img.textY : 0;
  self.layer = img.layer != undefined ? img.layer : 0;
  self.visible = img.visible != undefined ? img.visible : true;
  self.cache = img.cache != undefined ? img.cache : false;
  self.debug = img.debug != undefined ? img.debug : false;
  self.w = self.h = self.ox = self.oy = self.ow = self.oh = 0;
  self.onload = function() {
    this.adjustScale();
    if (window.customImage.loading > 0) window.customImage.loading--;
    // console.log(`Ready ${window.customImage.loading}: ${self.src}`);
  }
  self.onerror = function() {
    console.log(`Failed to load image "${self.src}"`);
    if (window.customImage.loading) window.customImage.loading--;
  }
  self.adjustClipX = function() {
    this.ox = this.clipX * this.w / this.width;
    this.ow = this.clipW ? this.clipW * this.w / this.width : this.w - this.ox;
  }
  self.adjustClipY = function() {
    this.oy = this.clipY * this.h / this.height;
    this.oh = this.clipH ? this.clipH * this.h / this.height : this.h - this.oy;
  }
  self.adjustClip = function() {
    this.adjustClipX();
    this.adjustClipY();
  }
  self.adjustScaleX = function() {
    this.w = this.width * this.scaleX;
    this.adjustClipX();
  }
  self.adjustScaleY = function() {
    this.h = this.height * this.scaleY;
    this.adjustClipY();
  }
  self.adjustScale = function() {
    this.adjustScaleX();
    this.adjustScaleY();
  }
  self.setScaleX = function(scale) {
    this.scaleX = scale;
    this.adjustScaleX();
  }
  self.setScaleY = function(scale) {
    this.scaleY = scale;
    this.adjustScaleY();
  }
  self.setScale = function(scaleX, scaleY) {
    this.scaleX = scaleX;
    this.scaleY = scaleY != undefined ? scaleY : scaleX;
    this.adjustScale();
  }
  self.setClipX = function(clip) {
    this.clipX = clip;
    this.adjustClipX();
  }
  self.setClipY = function(clip) {
    this.clipY = clip;
    this.adjustClipY();
  }
  self.setClipW = function(clip) {
    this.clipW = clip;
    this.adjustClipX();
  }
  self.setClipH = function(clip) {
    this.clipH = clip;
    this.adjustClipY();
  }
  self.setClip = function(clipX, clipY, clipW, clipH) {
    if (clipW == undefined && clipH == undefined) {
      this.clipW = clipX;
      this.clipH = clipY;
      this.clipX = (this.width - clipX) / 2;
      this.clipY = (this.height - clipY) / 2;
    } else {
      this.clipX = clipX;
      this.clipY = clipY;
      this.clipW = clipW;
      this.clipH = clipH;
    }
    this.adjustClip();
  }
  self.setWH = function(aw, ah) {
    if (aw === true || aw === false) {
      if (ah !== true && ah !== false) {
        let h = this.h * ah / this.oh;
        if (aw === true) this.w = this.w * h / this.h;
        this.h = h;
      }
    } else {
      let w = this.w * aw / this.ow;
      if (ah === true) {
        this.h = this.h * w / this.w;
      } else if (ah !== false) {
        let h = this.h * w / this.w;
        let oh = this.clipH ? this.clipH * h / this.height : h;
        if (oh > ah) {
          h = this.h * ah / this.oh;
          w = this.w * h / this.h;
        }
        this.h = h;
      }
      this.w = w;
    }
    this.scaleX = this.w / this.width;
    this.scaleY = this.h / this.height;
    this.adjustClip();
  }
  self.setContain = function(ax, ay, aw, ah) {
    this.setWH(aw, ah);
    this.setCenter(ax, ay, aw, ah);
  }
  self.setCover = function(ax, ay, aw, ah) {
    let w = this.w * aw / this.ow;
    let h = this.h * w / this.w;
    let oh = this.clipH ? this.clipH * h / this.height : h;
    if (oh < ah) {
      h = this.h * ah / this.oh;
      w = this.w * h / this.h;
    }
    this.w = w;
    this.h = h;
    this.scaleX = this.w / this.width;
    this.scaleY = this.h / this.height;
    this.adjustClip();
    this.setCenter(ax, ay, aw, ah);
  }
  self.setFit = function(ax, ay, aw, ah) {
    let w = this.w * aw / this.ow;
    let h = this.h * ah / this.oh;
    this.w = this.w * h / this.h;
    this.h = this.h * w / this.w;
    this.w = w;
    this.h = h;
    this.scaleX = this.w / this.width;
    this.scaleY = this.h / this.height;
    this.adjustClip();
    this.setCenter(ax, ay, aw, ah);
  }
  self.setCenter = function(ax, ay, aw, ah) {
    this.px = ax + aw / 2;
    this.py = ay + ah / 2;
  }
  self.setCenterX = function(ax, aw) {
    this.px = ax + aw / 2;
  }
  self.setCenterY = function(ay, ah) {
    this.py = ay + ah / 2;
  }
  self.hit = function(x, y, px, py) {
    if (px == undefined) px = this.px;
    if (py == undefined) py = this.py;
    x -= px + this.bx - this.ow / 2;
    y -= py + this.by - this.oh / 2;
    return x >= 0 && x < this.ow && y >= 0 && y < this.oh ? [x, y] : false;
  }
  self.drawPos = function(x, y) {
    if (x == undefined) x = this.px;
    if (y == undefined) y = this.py;
    return [x + this.bx - this.ox - this.ow / 2, y + this.by - this.oy - this.oh / 2]
  }
  self.draw = function(ctx, x, y, fx, rot) {
    if (!this.visible) return;
    let vx, vy;
    if (x == undefined) x = this.px;
    if (y == undefined) y = this.py;
    [vx, vy] = this.drawPos(x, y);
    if (fx == undefined) fx = false;
    if (rot == undefined) rot = false;
    if (rot !== false) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot * Math.PI / 180);
      ctx.translate(-x, -y);
    }
    if (fx) {
      ctx.save();
      ctx.scale(-1, 1);
      if (self.debug || customImage.globalDebug) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(-vx - this.ow - this.ox * 2, vy, this.w, this.h);
      }
      ctx.drawImage(this, -vx - this.ow - this.ox * 2, vy, this.w, this.h);
      if (self.debug || customImage.globalDebug) {
        ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
        ctx.fillRect(-vx - this.ox - this.ow, vy + this.oy, this.ow, this.oh);

        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillRect(-x - 5, y - 5, 10, 10);
      }
      ctx.restore();
    } else {
      if (self.debug || customImage.globalDebug) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(vx, vy, this.w, this.h);
      }
      ctx.drawImage(this, vx, vy, this.w, this.h);
      if (self.debug || customImage.globalDebug) {
        ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
        ctx.fillRect(vx + this.ox, vy + this.oy, this.ow, this.oh);

        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillRect(x - 5, y - 5, 10, 10);
      }
    }
    if (this.text) {
      let texts = String(this.text).split("\n");
      let tx = x + (this.textX !== false ? this.textX : 0);
      let ty = y + (this.textY !== false ? this.textY : 0) - (texts.length - 1) * 12;
      for (let n in texts) {
        ctx.font = "Bold 20px Tahoma";
        ctx.fillStyle = "#FFFF00";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.textAlign = 'center';
        ctx.textBaseline = "middle";
        ctx.strokeText(texts[n], tx, ty);
        ctx.fillText(texts[n], tx, ty);
        ty += 24;
      }
    }
    if (rot !== false) ctx.restore();
  }
  self.data = function() {
    return {
      w: this.w,
      h: this.h,
      px: this.px,
      py: this.py,
      ox: this.ox,
      oy: this.oy,
      ow: this.ow,
      oh: this.oh,
      bx: this.bx,
      by: this.by,
      clipX: this.clipX,
      clipY: this.clipY,
      clipW: this.clipW,
      clipH: this.clipH,
      text: this.text,
      textX: this.textX,
      textY: this.textY,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      src: this.src,
      layer: this.layer,
      visible: this.visible,
      cache: this.cache,
    }
  }
  if (img.src != undefined) {
    self.src = img.src + (self.cache ? `?v=${self.cache}` : '');
    window.customImage.loading++;
    // console.log(img.src);
  }
  return self;
}
function customImages() {
  this.images = [];
  if (typeof arguments[0] == 'string') {
    const format = arguments[0] || '';
    let num = arguments[1] || 0;
    let last = arguments[2] || 0;
    const pad = arguments[3] || 0;
    while (num <= last) {
      const name = format.replace(/\{\}/, String(num).padStart(pad, '0'));
      this.images.push(new customImage(name));
      num++;
    }
  } else {
    let count = arguments[0] || 0;
    const img = arguments[1] || {}
    while (count--) this.images.push(new customImage(img));
  }
  this.length = function() {
    return this.images.length;
  }
  this.get = function(target, name) {
    if (isNaN(name)) {
      if (typeof this[name] == 'function') return this[name]();
      return this[name];
    }
    return this.images[name];
  }
  return new Proxy(this, this);
}