const DOMManager = (function () {
  let startX = 10;
  let startY = 10;

  return {
    cubicCheckbox: 0,

    preload() {

    },
    
    setup() {
      // startX = windowWidth > width ? 10 : 10;
      // startY = windowWidth > width ? 10 : height + 10;

      // this.cubicSpan = createSpan('Cubic Interpolation');
      // this.cubicSpan.position(startX, startY);

      this.cubicCheckbox = createCheckbox('Cubic Interpolation');
      this.cubicCheckbox.position(startX, startY);
    },
  }
})()