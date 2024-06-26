const ProcessManager = (function () {
  let state = 'nothing';

  const maxFPS = 60;

  const debugStates = true;

  let earthMap = 0;

  return {
    changeState(s) {
      state = s;

      if (debugStates) console.log('State Change: ' + s);
    },

    preload() {
      earthMap = loadImage('assets/earth.png');
    },

    setup() {
      
      earthMap.resize(width, height);
    },

    draw(dt) {
      // switch (state) {
      //   default:
      //     // do nothing
      //     break;
      // }

      background(0);

      image(earthMap, 0, 0);
    }
  }
})()