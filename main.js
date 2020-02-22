let GEO_TYPES = [
  "box",
  "cone",
  "cylinder",
  "octahedron",
  "sphere",
  "tetrahedron",
  "torus",
  "torusKnot"
];

function init() {
  let scene = new THREE.Scene();
  let clock = new THREE.Clock();
  let gui = new dat.GUI();
  // initialize objects
  let objMaterial = getMaterial("standard", "rgb(255, 255, 255)");

  let geoTypes = GEO_TYPES;

  geoTypes.forEach(function(type) {
    let geo = getGeometry(type, 5, objMaterial);

    scene.add(geo);
  });

  let lightLeft = getSpotLight(1, "rgb(255, 220, 180)");
  let lightRight = getSpotLight(1, "rgb(255, 220, 180)");
  let lightBottom = getPointLight(0.33, "rgb(255, 220, 150)");

  lightLeft.position.x = -5;
  lightLeft.position.y = 2;
  lightLeft.position.z = -4;

  lightRight.position.x = 5;
  lightRight.position.y = 2;
  lightRight.position.z = -4;

  lightBottom.position.x = 0;
  lightBottom.position.y = 10;
  lightBottom.position.z = 0;

  // load the environment map
  let path = "./cubemap/";
  let format = ".jpg";
  let fileNames = ["posx", "negx", "posy", "negy", "posz", "negz"];

  let reflectionCube = new THREE.CubeTextureLoader().load(
    fileNames.map(function(fileName) {
      return path + fileName + format;
    })
  );
  scene.background = reflectionCube;

  // manipulate materials
  let loader = new THREE.TextureLoader();
  objMaterial.roughnessMap = loader.load(
    "./clear-glass-window-with-moist-effect-989941.jpg"
  );
  objMaterial.bumpMap = loader.load(
    "./clear-glass-window-with-moist-effect-989941.jpg"
  );
  objMaterial.bumpScale = 0.01;
  objMaterial.envMap = reflectionCube;

  objMaterial.roughness = 0.5;
  objMaterial.metalness = 0.7;

  let maps = ["bumpMap", "roughnessMap"];
  maps.forEach(function(map) {
    let texture = objMaterial[map];
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
  });
  // add other objects to the scene
  scene.add(lightLeft);
  scene.add(lightRight);
  scene.add(lightBottom);

  // camera
  let cameraGroup = new THREE.Group();
  let camera = new THREE.PerspectiveCamera(
    45, // field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    1, // near clipping plane
    1000 // far clipping plane
  );

  camera.position.z = 20;
  camera.position.x = 0;
  camera.position.y = 5;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  cameraGroup.add(camera);
  cameraGroup.name = "sceneCameraGroup";
  scene.add(cameraGroup);
  let animation = {
    Shapes: "box",
    Animate: true
  };
  gui.add(animation, "Shapes", {
    Box: "box",
    Cone: "cone",
    Cylinder: "cylinder",
    Octahedron: "octahedron",
    Sphere: "sphere",
    Tetrahedron: "tetrahedron",
    Torus: "torus",
    "Torus Knot": "torusKnot"
  });
  gui.add(animation, "Animate", { True: true, False: false });
  let folder2 = gui.addFolder("Positions");
  folder2.add(camera.position, "z", -100, 100);
  folder2.add(camera.position, "y", -100, 100);
  folder2.add(camera.position, "x", -1000, 1000);
  let folder3 = gui.addFolder("Left Light");
  folder3.add(lightLeft.position, "z", -100, 100);
  folder3.add(lightLeft.position, "y", -100, 100);
  folder3.add(lightLeft.position, "x", -1000, 1000);
  folder3.add(lightLeft.color, "r", 0, 5);
  folder3.add(lightLeft.color, "g", 0, 5);
  folder3.add(lightLeft.color, "b", 0, 5);
  let folder4 = gui.addFolder("Right Light");
  folder4.add(lightRight.position, "z", -100, 100);
  folder4.add(lightRight.position, "y", -100, 100);
  folder4.add(lightRight.position, "x", -1000, 1000);
  folder4.add(lightRight.color, "r", 0, 5);
  folder4.add(lightRight.color, "g", 0, 5);
  folder4.add(lightRight.color, "b", 0, 5);
  let folder5 = gui.addFolder("Bottom Light");
  folder5.add(lightBottom.position, "z", -100, 100);
  folder5.add(lightBottom.position, "y", -100, 100);
  folder5.add(lightBottom.position, "x", -1000, 1000);
  folder5.add(lightBottom.color, "r", 0, 5);
  folder5.add(lightBottom.color, "g", 0, 5);
  folder5.add(lightBottom.color, "b", 0, 5);
  console.log("lightBottom", lightBottom);
  // renderer
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById("webgl").appendChild(renderer.domElement);
  let controls = new THREE.OrbitControls(camera, renderer.domElement);
  if (animation.Animate === false) return;

  update(renderer, scene, camera, clock, animation, controls);

  return scene;
}

function getGeometry(type, size, material) {
  let geometry;
  let segmentMultiplier = 0.25;

  switch (type) {
    case "box":
      geometry = new THREE.BoxGeometry(size, size, size);
      break;
    case "cone":
      geometry = new THREE.ConeGeometry(size, size, 256 * segmentMultiplier);
      break;
    case "cylinder":
      geometry = new THREE.CylinderGeometry(
        size / 2,
        size / 2,
        size * 2,
        32 * segmentMultiplier
      );
      break;
    case "octahedron":
      geometry = new THREE.OctahedronGeometry(size);
      break;
    case "sphere":
      geometry = new THREE.SphereGeometry(
        size,
        32 * segmentMultiplier,
        32 * segmentMultiplier
      );
      break;
    case "tetrahedron":
      geometry = new THREE.TetrahedronGeometry(size);
      break;
    case "torus":
      geometry = new THREE.TorusGeometry(
        size / 2,
        size / 4,
        16 * segmentMultiplier,
        100 * segmentMultiplier
      );
      break;
    case "torusKnot":
      geometry = new THREE.TorusKnotGeometry(
        size / 2,
        size / 6,
        256 * segmentMultiplier,
        100 * segmentMultiplier
      );
      break;
    default:
      break;
  }

  let obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.name = type;

  return obj;
}

function getMaterial(type, color) {
  let selectedMaterial;
  let materialOptions = {
    color: color === undefined ? "rgb(255, 255, 255)" : color
    // wireframe: true
  };

  switch (type) {
    case "basic":
      selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
      break;
    case "lambert":
      selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
      break;
    case "phong":
      selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
      break;
    case "standard":
      selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
      break;
    default:
      selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
      break;
  }

  return selectedMaterial;
}

function getPointLight(intensity, color) {
  let light = new THREE.PointLight(color, intensity);
  light.castShadow = true;

  return light;
}

function getSpotLight(intensity, color) {
  color = color === undefined ? "rgb(255, 255, 255)" : color;
  let light = new THREE.SpotLight(color, intensity);
  light.castShadow = true;
  light.penumbra = 0.5;

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 1024; // default: 512
  light.shadow.mapSize.height = 1024; // default: 512
  light.shadow.camera.near = 0.1; // default
  light.shadow.camera.far = 500; // default
  light.shadow.camera.fov = 30; // default
  light.shadow.bias = 0.001;

  return light;
}

function update(renderer, scene, camera, clock, animation, controls) {
  // rotate camera around the origin
  let sceneCameraGroup = scene.getObjectByName("sceneCameraGroup");

  if (animation.Animate === true) {
    sceneCameraGroup.rotation.y += 0.005;
  }
  // switch between objects
  let geoTypes = GEO_TYPES;
  controls.update();

  geoTypes.forEach(function(geo) {
    let currentObj = scene.getObjectByName(geo);
    if (animation.Shapes === currentObj.name) {
      currentObj.visible = true;
    } else {
      currentObj.visible = false;
    }
  });

  renderer.render(scene, camera);

  requestAnimationFrame(function() {
    update(renderer, scene, camera, clock, animation, controls);
  });
}

let scene = init();
