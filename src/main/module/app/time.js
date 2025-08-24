class customTime {
  #count;
  #amount;
  #remain;
  constructor(duration, amount) {
    this.setPeriod(duration, amount);
    this.clear();
  }
  clear() {
    this.time = 0.0;
    this.#count = 0.0;
    this.#remain = this.#amount;
  }
  get amount() { return this.#amount }
  set amount(n) { this.#amount = this.#remain = n }
  setPeriod(duration, amount) {
    if (duration == undefined) duration = 1000;
    if (amount == undefined) duration = 1;
    this.duration = duration;
    this.#amount = amount;
    this.#remain = amount;
  }
  start() {
    this.time = Date.now();
    this.#count = 0.0;
    this.#remain = this.#amount;
  }
  floatCount(refresh) {
    if (refresh == undefined) refresh = true;
    let ntime = Date.now();
    let result = this.#count + (ntime - this.time) / this.duration;
    this.#count = 0.0;
    if (refresh) this.time = ntime;
    return result;
  }
  countDown() {
    let result = false;
    let ntime = Date.now();
    if (ntime - this.time >= this.duration) {
      this.time = ntime;
      this.#remain--;
      if (this.#remain < 0) {
        this.#remain = this.#amount;
        return true;
      }
    }
    return false;
  }
  count(refresh) {
    if (refresh == undefined) refresh = true;
    let fc = this.floatCount(refresh);
    let result = Math.round(fc);
    if (refresh) this.#count = fc - result;
    return result;
  }
  interval(refresh) {
    if (refresh == undefined) refresh = true;
    return this.count(refresh) >= 1;
  }
  oneCount(refresh) {
    if (refresh == undefined) refresh = true;
    let result, fc = this.floatCount(refresh);
    if (result = fc >= 1.0) fc -= 1.0;
    if (refresh) this.#count = fc;
    return result;
  }
}