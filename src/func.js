class enemyData {
  constructor() {
    this.id = this.x = this.y = this.ww = this.hp = 0;
  }
  get image() {
    return enemyBitmaps[this.id - 1];
  }
  hit(spr, px, py, offset) {
    if (!offset) offset = 0;
    const img = this.image;
    const rw = scene.picX(spr.w) / 2;
    const rh = scene.picY(spr.h) / 2;
    const bw = Math.max(0, scene.picX(img.w) / 2 - offset);
    const bh = Math.max(0, scene.picY(img.h) / 2 - offset);
    return px >= this.x - bw - rw && px <= this.x + bw + rw
      && py >= this.y - bh - rh && py <= this.y + bh + rh;
  }
}
class enemyDatas {
  constructor(n) {
    this.items = [];
    this.index = this.delay = this.k = 0;
    while (n--) this.items.push(new enemyData());
    return new Proxy(this, this);
  }
  get(target, name) {
    if (isNaN(name)) return target[name];
    return target.items[name];
  }
}