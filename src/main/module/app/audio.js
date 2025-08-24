class customAudio {
  #ready = false;
  #timeout;
  constructor(src, volume, delay) {
    this.maxDelay = delay || 0;
    this.delay = 0;
    this.obj = document.createElement('audio');
    this.obj.volume = volume || 1.0;
    this.obj.src = src;
    document.body.appendChild(this.obj);
  }
  get ready() {
    if (!this.#ready) this.#ready = navigator.userActivation.isActive;
    return this.#ready && this.obj.readyState == 4;
  }
  get src() { return this.obj.src }
  set src(src) { this.obj.src = src }
  play(forced, looped) {
    if (looped != undefined) this.obj.loop = looped;
    if (this.ready && this.delay <= 0) {
      this.obj.currentTime = 0;
      this.obj.play();
      this.delay = this.maxDelay;
    } else if (forced) {
      this.#timeout = setTimeout(()=>{ this.play(forced, looped) }, 100);
    } else if (this.delay > 0) this.delay--;
  }
  stop() {
    if (this.#timeout) {
      clearTimeout(this.#timeout);
      this.#timeout = undefined;
    }
    this.obj.pause();
    this.obj.currentTime = 0;
  }
}