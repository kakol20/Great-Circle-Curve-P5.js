const MainManager = (function () {
	return {
		canvas: 0,

		preload() {
			DOMManager.preload();
			ProcessManager.preload();
		},

		setup() {
			// pixelDensity(1);

			let mapWidth = windowWidth;
			let mapHeight = mapWidth / 2;

			if (mapHeight > windowHeight) {
				mapHeight = windowHeight;
				mapWidth = mapHeight * 2;
			}

			this.canvas = createCanvas(mapWidth, mapHeight);
			this.canvas.position(0, 0);

			DOMManager.setup();
			ProcessManager.setup();

			// this.canvas.touchStarted(() => {
			//   // console.log('Touch Started');
			//   // this.mousePressed();
			// })
		},

		draw(dt) {
			ProcessManager.draw(dt);
		},

		mouseClicked() {
			console.log('Mouse Pressed');
			DOMManager.mouseClicked();
			ProcessManager.mouseClicked();
		}
	}
})();