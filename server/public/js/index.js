window.onload = function() {

  let scene, camera, renderer;

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  const VIEW_ANGLE = 70;
  const ASPECT = WIDTH/HEIGHT;
  const NEAR = 1;
  const FAR = 100;

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
    for (i = 0; i<5; i++) {
      loader.load('models/marmelab.json', function(geometry, materials) {
        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        // mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.75;
        mesh.translation = THREE.GeometryUtils.center(geometry);
        mesh.position.x = Math.random() * 8 - 6;
        mesh.position.y = Math.random() * 8 - 6;
        mesh.position.z = Math.random() * 8 - 6;

        mesh.rotation.x = Math.random()*2*Math.PI;
        mesh.rotation.y = Math.random()*2*Math.PI;
        mesh.rotation.z = Math.random()*2*Math.PI;

        scene.add(mesh);
      })
    }
  }

  function rotateMesh() {
    if (!mesh) {
      return;
    }

    for(i = 0; i<scene.children.length; i++) {
      scene.children[i].rotation.x -= SPEED*2;
      scene.children[i].rotation.y -= SPEED;
      scene.children[i].rotation.z -= SPEED*3;
    }
  }

  //Tween initialization
  let startx, starty;
  let position = { x : startx, y : starty};
  let target = { x : 5, y : 3};
  let tween = new TWEEN.Tween(position).to(target, 2000);

  //Click events
  let raycaster = new THREE.Raycaster();

  // This is for mousemove
  let mouse = new THREE.Vector2();

  //Dragging
  let isDragging = false;

  function onMouseDown(event) {
    isDragging = true;

    event.preventDefault();
    mouse.x = (event.clientX/window.innerWidth)*2 - 1;
    mouse.y = -(event.clientY/window.innerHeight)*2 + 1;
    mouse.set(mouse.x, mouse.y, mouse.z);
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);

    startx = mouse.y;
    starty = mouse.x;

    for (i = 0; i<intersects.length; i++) {
      tween.start();

      let intersection = intersects[i]
      let obj = intersection.object;
      tween.onUpdate(function(){
        obj.position.x = position.x;
        obj.position.y = position.y;
      })

      console.log(obj.id);
    }
  }

  function onMouseUp(event) {
    isDragging = false;
  }

  function onMouseMove(event) {
    mouse.x = (event.clientX/window.innerWidth)*2 - 1;
    mouse.y = -(event.clientY/window.innerHeight)*2 + 1;
    // Raycaster
    // Update the picking ray with the camera and mouse position.
    raycaster.setFromCamera(mouse, camera);
    // Calculate objects intersecting the picking ray
    let intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length) {
        console.log("hello");
    }

    if (isDragging) {
      let deltaX = event.clientX - mouse.x,
      deltaY = event.clientY - mouse.y;
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      rotateScene(deltaX, deltaY);
    }
  }

  function rotateScene(deltaX, deltaY) {
    let intersects = raycaster.intersectObjects(scene.children);
    for (i = 0; i<intersects.length; i++) {
      let intersection = intersects[i]
      let obj = intersection.object;
      obj.rotation.y += deltaX/10000;
      obj.rotation.x += deltaY/10000;
    }
  }

  function render() {
    requestAnimationFrame(render);
    // rotateMesh();

    TWEEN.update();
    renderer.render(scene,camera);
  }

  window.addEventListener('mousemove',onMouseMove, false);
  window.addEventListener('mousedown', onMouseDown, false);
  window.addEventListener('mouseup', onMouseUp, false);

  init();
  render();

}
