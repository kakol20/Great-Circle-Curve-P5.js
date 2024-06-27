function preload() {
  MainManager.preload()
}
function setup() {
  MainManager.setup()
}
function draw() {
  MainManager.draw(deltaTime / 1000.0)
}
function mousePressed() {
  // MainManager.mousePressed();
}
function mouseClicked() {
  MainManager.mousePressed();
}