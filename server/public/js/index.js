let scene, camera, renderer;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const VIEW_ANGLE = 70;
const ASPECT = WIDTH/HEIGHT;
const NEAR = 1;
const FAR = 10;

const SPEED = 0.01;
let cube;

function init() {
  scene = new THREE.Scene();
  initLights();
  initMesh();
  initCamera();
  initRenderer();
  document.body.appendChild(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.set(0, 3.5, 5);
  camera.lookAt(scene.position);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setSize(WIDTH,HEIGHT);
}

function initLights() {
  let light = new THREE.AmbientLight(0xffffff);
  scene.add(light);
}

let mesh = null;
function initMesh() {
  let loader = new THREE.JSONLoader();
  loader.load('models/marmelab.json', function(geometry, materials) {
    mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.75;
    mesh.translation = THREE.GeometryUtils.center(geometry);
    scene.add(mesh);
  })
  // cube = new THREE.Mesh(new THREE.CubeGeometry(2,2,2),new THREE.MeshNormalMaterial());
  // scene.add(cube);
}

function rotateMesh() {
  if (!mesh) {
    return;
  }
  mesh.rotation.x -= SPEED*2;
  mesh.rotation.y -= SPEED;
  mesh.rotation.z -= SPEED*3;
}

//Click events
// let projector = new THREE.Projector();
let raycaster = new THREE.Raycaster();
// This is for mousemove
let mouse = new THREE.Vector2();
// This is for mouseclick
// let mouse_vector = new THREE.Vector2();

// function onMouseMove(event) {
//   mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
//   mouse.y = - (event.clientY/window.innerHeight)* 2 + 1;
// }
function onMouseMove(event) {

  mouse.x = (event.clientX/window.innerWidth)*2 - 1;
  mouse.y = -(event.clientY/window.innerHeight)*2 + 1;

  // Raycaster
  // Update the picking ray with the camera and mouse position.
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  let intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length) {
    // console.log("hello");
    // // alert("hello");
    // let foo = true;
    // let step = 0;
    // while(foo) {
    //   step++;

      mesh.translateX(0.05);
      mesh.translateY(0.05);
      mesh.translateZ(0.05); 

    //   if (step>= 40) {
    //     foo = false;
    //   }
    // }
    // mesh.position.x += 1;
    // mesh.position.y += 1;

  }

}

function render() {
  requestAnimationFrame(render);
  rotateMesh();


  renderer.render(scene,camera);
}

window.addEventListener('mousemove',onMouseMove, false);

init();
render();
