const ProcessManager = (function () {
  // ----- FUNCTIONS -----

  // https://www.desmos.com/calculator/jhmsnutnai
  function CubicInterpolate(a, b, c, d, t) {
    return b + 0.5 * t * (c - a + t * (2 * a - 5 * b + 4 * c - d + t * (3 * (b - c) + d - a)));
  }

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

  function CartesionCubic(a, b, c, d, t) {
    const x = CubicInterpolate(a.x, b.x, c.x, d.x, t);
    const y = CubicInterpolate(a.y, b.y, c.y, d.y, t);
    const z = CubicInterpolate(a.z, b.z, c.z, d.z, t);

    return { x: x, y: y, z: z };
  }

  // ----- DRAWING FUNCTIONS -----

  function DrawVertices(vertices = []) {
    beginShape();

    for (let i = 0; i < vertices.length; i++) {
      if (i > 0) {
        // X Axis wrap around
        if (Math.abs(vertices[i].x - vertices[i - 1].x) > width / 2) {
          if (vertices[i].x > width / 2) {
            vertex(vertices[i].x - width, vertices[i].y);
            endShape();
            beginShape();
            vertex(vertices[i - 1].x + width, vertices[i - 1].y);
          } else {
            vertex(vertices[i].x + width, vertices[i].y);
            endShape();
            beginShape();
            vertex(vertices[i - 1].x - width, vertices[i - 1].y);
          }
        } else {
          vertex(vertices[i].x, vertices[i].y);
        }
      } else {
        vertex(vertices[i].x, vertices[i].y);
      }
    }
    endShape();
  }

  // a & b in cartesian coordinates
  function DrawPathLerp(a, b, segments = 10, lineWidth = 2) {
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

    DrawVertices(vertices);
  }

  function DrawPathCubic(a, b, c, d, segments = 10, lineWidth = 2) {
    noFill();
    strokeWeight(3);
    stroke(0, 255);
    strokeWeight(lineWidth);

    let vertices = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;

      const cartesianPoint = CartesionCubic(a, b, c, d, t);
      const mapPoint = CartesianToMap(cartesianPoint);

      // vertex(mapPoint.x, mapPoint.y);
      vertices.push(mapPoint);
    }

    DrawVertices(vertices);
  }

  function DrawMapPoint(c, shade = 255) {
    ellipseMode(CENTER);
    fill(shade, 255);
    stroke(0, 255);
    strokeWeight(1);

    circle(c.x, c.y, 5);
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
      // London Heathrow
      lat: 51.4680 * DegToRad,
      lon: -0.4551 * DegToRad
    },
    {
      // Leipzig
      lat: 51.4187 * DegToRad,
      lon: 12.2342 * DegToRad
    },
    {
      // Prague
      lat: 50.1018 * DegToRad,
      lon: 14.2632 * DegToRad
    },
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
      // Muscat
      lat: 23.6013 * DegToRad,
      lon: 58.2886 * DegToRad
    },
    {
      // Nagoya
      lat: 34.8588 * DegToRad,
      lon: 136.8115 * DegToRad
    },
    {
      // San Diego
      lat: 32.7332 * DegToRad,
      lon: -117.1897 * DegToRad
    },
    {
      // Washington
      lat: 38.9523 * DegToRad,
      lon: -77.4586 * DegToRad
    },
    {
      // Sint Maarten
      lat: 18.0442 * DegToRad,
      lon: -63.1134 * DegToRad
    }
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
      // for (let i = 0; i < locCartesian.length ; i++) {
      //   DrawPathLerp(locCartesian[bIndex], locCartesian[cIndex], 32);
      // }
      for (let i = 0; i < locCartesian.length; i++) {
        const aIndex = (((i - 1) % locCartesian.length) + locCartesian.length) % locCartesian.length;
        const bIndex = i;
        const cIndex = (i + 1) % locCartesian.length;
        const dIndex = (i + 2) % locCartesian.length;

        if (DOMManager.cubicCheckbox.checked()) {
          DrawPathCubic(locCartesian[aIndex], locCartesian[bIndex], locCartesian[cIndex], locCartesian[dIndex], 32);
        } else {
          DrawPathLerp(locCartesian[bIndex], locCartesian[cIndex], 32);
        }
      }

      for (let i = 0; i < locMap.length; i++) {
        DrawMapPoint(locMap[i]);
      }
    }
  }
})()