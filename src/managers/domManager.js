const DOMManager = (function () {
  let startX = 10;
  let startY = 10;

  return {
    cubicCheckbox: 0,
    loopCheckbox: 0,
    resetButton: 0,

    domPressed: false,

    preload() {

    },

    setup() {
      startX = windowWidth > width ? 10 : 10;
      startY = windowWidth > width ? 10 : height + 10;

      this.cubicCheckbox = createCheckbox('Cubic Interpolation');
      this.cubicCheckbox.position(startX, startY);

      startY += 15 + this.cubicCheckbox.height;

      this.loopCheckbox = createCheckbox('Loop');
      this.loopCheckbox.position(startX, startY);

      startY += 10 + this.loopCheckbox.height;

      this.resetButton = createButton('Clear');
      this.resetButton.position(startX, startY);

      this.resetButton.mousePressed(() => { ProcessManager.reset(); });
      this.resetButton.touchStarted(() => { ProcessManager.reset(); });
    },

    mousePressed() {
      if (mouseX >= this.resetButton.position().x && mouseX <= this.resetButton.position().x + this.resetButton.width &&
        mouseY >= this.resetButton.position().y && mouseY <= this.resetButton.position().y + this.resetButton.height) {
        this.domPressed = true;
      }
      else if (mouseX >= this.loopCheckbox.position().x && mouseX <= this.loopCheckbox.position().x + this.loopCheckbox.width &&
        mouseY >= this.loopCheckbox.position().y && mouseY <= this.loopCheckbox.position().y + this.loopCheckbox.height) {
        this.domPressed = true;
      }
      else if (mouseX >= this.cubicCheckbox.position().x && mouseX <= this.cubicCheckbox.position().x + this.cubicCheckbox.width &&
        mouseY >= this.cubicCheckbox.position().y && mouseY <= this.cubicCheckbox.position().y + this.cubicCheckbox.height) {
        this.domPressed = true;
      } else {
        this.domPressed = false;
      }
    }
  }
})()