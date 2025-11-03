class customAudio {
  #ready = false;
  #timeout;
  constructor(src, volume, delay) {
    this.maxDelay = delay || 0;
    this.delay = 0;
    this.player = new Audio(src);
    this.player.volume = volume || 1.0;
  }
  get ready() {
    if (!this.#ready) this.#ready = navigator.userActivation.isActive;
    return this.#ready && this.player.readyState == 4;
  }
  get src() { return this.player.src }
  set src(src) { this.player.src = src }
  play(forced, looped) {
    if (looped != undefined) this.player.loop = looped;
    if (this.ready && this.delay <= 0) {
      this.player.currentTime = 0;
      this.player.play();
      this.delay = this.maxDelay;
    } else if (forced) {
      this.#timeout = setTimeout(()=>{ this.play(forced, looped) }, 100);
    } else if (this.delay > 0) this.delay--;
  }
  pause(paused) {
    if (paused == undefined) paused = true;
    if (paused) {
      this.player.pause();
    } else this.player.play();
  }
  stop() {
    if (this.#timeout) {
      clearTimeout(this.#timeout);
      this.#timeout = undefined;
    }
    this.player.pause();
    this.player.currentTime = 0;
  }
}