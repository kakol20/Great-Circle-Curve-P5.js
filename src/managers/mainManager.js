const MainManager = (function () {
  return {
    canvas: 0,

    preload() {
      DOMManager.preload();
    },

    setup() {
      pixelDensity(1);

      this.canvas = createCanvas(windowWidth, windowHeight);
      this.canvas.position(0, 0);

      ProcessManager.setup();
    },

    draw(dt) {
      ProcessManager.draw(dt);
    }
  }
})();