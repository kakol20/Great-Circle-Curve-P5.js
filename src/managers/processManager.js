const ProcessManager = (function () {
  // ----- FUNCTIONS -----

  // Spherical Coordinates to Cartesian Coordinates
  function SphericalToCartesian(c) {
    const x = Math.cos(c.lat) * Math.cos(c.lon);
    const y = Math.cos(c.lat) * Math.sin(c.lon);
    const z = Math.sin(c.lat);

    return { x: x, y: y, z: z };
  }

  function CartesianToSpherical(c) {
    const lon = Math.atan2(c.y, c.x);
    const lat = Math.atan2(c.z, Math.sqrt(c.x * c.x + c.y * c.y));

    return { lat: lat, lon: lon };
  }

  // Spherical Coordinates to Mercator Projection
  function SphericalToMercator(c) {
    let x = c.lon;
    let y = Math.log(Math.tan((Math.PI / 4) + (c.lat / 2)));

    return { x: x, y: y };
  }

  // Mercator Projection to Image Map
  function MercatorToMap(c) {
    let x = (c.x + Math.PI) * (width / (2 * Math.PI));
    let y = c.y * -1;
    y = (height / 2) + ((height * y) / (2 * Math.PI));

    return { x: x, y: y };
  }

  function CartesianToMap(c) {
    const spherical = CartesianToSpherical(c);
    const mercator = SphericalToMercator(spherical);
    return MercatorToMap(mercator);
  }

  function CartesianLerp(a, b, t) {
    const x = ((a.x - b.x) * t) + b.x;
    const y = ((a.y - b.y) * t) + b.y;
    const z = ((a.z - b.z) * t) + b.z;

    return { x: x, y: y, z: z };
  }

  // a & b in cartesian coordinates
  function DrawPathLerp(a, b, segments = 10, lineWidth = 2.5) {
    noFill();
    strokeWeight(3);
    stroke(0, 255);
    strokeWeight(lineWidth);

    let vertices = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;

      const cartesianPoint = CartesianLerp(a, b, t);
      const mapPoint = CartesianToMap(cartesianPoint);

      // vertex(mapPoint.x, mapPoint.y);
      vertices.push(mapPoint);
    }

    beginShape();

    for (let i = 0; i < vertices.length; i++) {
      if (i > 0) {
        // X Axis wrap around
        if (Math.abs(vertices[i].x - vertices[i - 1].x) > width / 2) {
          vertex(vertices[i].x - width, vertices[i].y);
          endShape();
          beginShape();
          vertex(vertices[i - 1].x + width, vertices[i - 1].y);
        } else {
          vertex(vertices[i].x, vertices[i].y);
        }
      } else {
        vertex(vertices[i].x, vertices[i].y);
      }
    }
    endShape();
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
  // let locSpherical = [
  //   {
  //     // Innsbruck
  //     lat: 47.2576 * DegToRad,
  //     lon: 11.3513 * DegToRad
  //   },
  //   {
  //     // Bari
  //     lat: 41.1375 * DegToRad,
  //     lon: 16.7652 * DegToRad
  //   },
  //   {
  //     // Prague
  //     lat: 50.1018 * DegToRad,
  //     lon: 14.2632 * DegToRad
  //   },
  //   {
  //     // Heathrow
  //     lat: 51.4680 * DegToRad,
  //     lon: -0.4551 * DegToRad
  //   },
  // ];
  let locSpherical = [
    {
      // Prague
      lat: 50.1018 * DegToRad,
      lon: 14.2632 * DegToRad
    },
    {
      // Sydney
      lat: -33.9500 * DegToRad,
      lon: 151.1817 * DegToRad
    },
    {
      // Anchorage
      lat: 61.1769 * DegToRad,
      lon: -149.9906 * DegToRad
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

      // DrawPathLerp(locCartesian[0], locCartesian[1], 20);
      for (let i = 0; i < locCartesian.length ; i++) {
        DrawPathLerp(locCartesian[i], locCartesian[(i + 1) % locCartesian.length], 32);
      }

      for (let i = 0; i < locMap.length; i++) {
        DrawMapPoint(locMap[i]);
      }
    }
  }
})()