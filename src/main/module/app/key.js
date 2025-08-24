class customKeyButton {
  constructor() { this.value = 0 }
  get down() { return this.value & 1 }
  set down(v) { this.value = v ? this.value | 1 : this.value & 0xfe }
  get stay() { return this.value & 2 }
  set stay(v) { this.value = v ? this.value | 2 : this.value & 0xfd }
}

class customKey {
  #keys = [];
  constructor() {
    this.clear();
  }
  clear() {
    this.#keys = [];
    this.lastKey = 0;
    this.lastKeyDown = 0;
    this.lastKeyUp = 0;
  }
  key(code) { return this.#keys[code] || (this.#keys[code] = new customKeyButton()) }
  values(code) {
    return this.key(code).value;
  }
  update(code, down) {
    this.key(code).down = down;
    this.lastKey = code;
    if (down) this.lastKeyDown = code
    else this.lastKeyUp = code;
  }
  down(code) {
    const key = this.key(code);
    key.stay = key.down;
    return key.down;
  }
  press(code) {
    const key = this.key(code);
    key.stay = key.down;
    key.down = false;
    return key.stay;
  }
  pressOnce(code) {
    const key = this.key(code);
    const result = key.down && !key.stay;
    key.stay = key.down;
    return result;
  }
  toggle(code) {
    const key = this.key(code);
    const result = key.down ^ key.stay;
    key.stay = key.down;
    return result;
  }
}