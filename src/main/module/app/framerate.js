class customFrameRate {
  #rate = 0;
  #count = 0;
  #time = Date.now() / 1000;
  get rate() {
    return this.#rate;
  }
  update() {
    const ntime = Date.now() / 1000;
    this.#count++;
    if (ntime - this.#time > 1) {
      this.#rate = (this.#rate + this.#count / (ntime - this.#time)) / 2;
      this.#count = 0;
      this.#time = ntime;
    }
    return this.#rate;
  }
}