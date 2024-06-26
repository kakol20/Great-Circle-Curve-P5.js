const ProcessManager = (function () {
  let state = 'nothing';

  const maxFPS = 60;

  const debugStates = true;

  return {
    changeState(s) {
      state = s;

      if (debugStates) console.log('State Change: ' + s);
    },

    setup() {

    },

    draw(dt) {
      switch (state) {
        default:
          // do nothing
          break;
      }
    }
  }
})()