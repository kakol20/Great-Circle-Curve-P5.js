const ProcessManager = (function () {
  // ----- FUNCTIONS -----

  // Spherical Coordinates to Cartesian Coordinates
  function SphericalToCartesian(c) {
    const x = Math.cos(c.lat) * Math.cos(c.lon);
    const y = Math.cos(c.lat) * Math.sin(c.lon);
    const z = Math.sin(c.lat);

    return { x: x, y: y, z: z }
  }

  // Spherical Coordinates to Mercator Projection
  function SphericalToMercator(c) {
    let x = c.lon;
    let y = Math.log(Math.tan((Math.PI / 4) + (c.lat / 2)));

    return { x: x, y: y }
  }

  // Mercator Projection to Image Map
  function MercatorToMap(c) {
    let x = (c.x + Math.PI) * (width / (2 * Math.PI));
    let y = c.y * -1;
    y = (height / 2) + ((height * y) / (2 * Math.PI));

    return { x: x, y: y };
  }

  function DrawMapPoint(c) {
    ellipseMode(CENTER);
    fill(255, 128);
    stroke(0, 255);
    strokeWeight(1);

    circle(c.x, c.y, 10);
  }

  // ----- VARIABLES -----

  let state = 'nothing';

  const maxFPS = 60;

  const debugStates = true;

  const DegToRad = Math.PI / 180;

  let earthMap = 0;

  // lat = y axis, lon = x axis
  let locSpherical = [
    {
      // Innsbruck
      lat: 47.2576 * DegToRad,
      lon: 11.3513 * DegToRad
    },
    {
      // Bari
      lat: 41.1375 * DegToRad,
      lon: 16.7652 * DegToRad
    },
    {
      // Prague
      lat: 50.1018 * DegToRad,
      lon: 14.2632 * DegToRad
    },
    {
      // Heathrow
      lat: 51.4680 * DegToRad,
      lon: -0.4551 * DegToRad
    },
  ];
  console.log('Spherical Coordinates', locSpherical);

  let locCartesian = [];
  for (let i = 0; i < locSpherical.length; i++) {
    locCartesian.push(SphericalToCartesian(locSpherical[i]));
  }
  console.log('Cartesian Coordinates', locCartesian);

  let locMercator = [];
  for (let i = 0; i < locSpherical.length; i++) {
    locMercator.push(SphericalToMercator(locSpherical[i]));
  }
  console.log('Mercator Projection Coordinates', locMercator);

  let locMap = [];

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

      for (let i = 0; i < locMercator.length; i++) {
        locMap.push(MercatorToMap(locMercator[i]));
      }
      console.log('Image Map Coordinates', locMap);
    },

    draw(dt) {
      // switch (state) {
      //   default:
      //     // do nothing
      //     break;
      // }

      background(0);

      image(earthMap, 0, 0);

      for (let i = 0; i < locMap.length; i++) {
        DrawMapPoint(locMap[i]);
      }
    }
  }
})()