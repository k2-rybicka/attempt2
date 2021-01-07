import * as THREE from "three";
import * as Tone from "tone";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./styles.css";

let scene, camera, renderer;
let colour, intensity, light;
let ambientLight;

let selected;

let orbit;
let loader = new THREE.TextureLoader();

let sceneHeight, sceneWidth;

let clock, delta, interval;

let geometry, material;
let sphere;
let cube;

let hello, listener, audioLoader, hola;

let size = 10;
let divisions = 10;
let gridHelper = new THREE.GridHelper(size, divisions);

let startButton = document.getElementById("startButton");
startButton.addEventListener("click", init);

function init() {
  let overlay = document.getElementById("overlay");
  overlay.remove();
  Tone.start();

  clock = new THREE.Clock();
  delta = 0;
  interval = 1 / 25;

  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#d1b8db");

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.position.x = 0;
  camera.position.y = 0;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableZoom = true;
  //orbit.enableRotate = false;

  colour = 0xffffff;
  intensity = 1;
  light = new THREE.DirectionalLight(colour, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
  ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambientLight);

  listener = new THREE.AudioListener();
  camera.add(listener);
  hello = new THREE.PositionalAudio(listener);
  hola = new THREE.PositionalAudio(listener);

  audioLoader = new THREE.AudioLoader();
  audioLoader.load("./sounds/hello.wav", function (buffer) {
    hello.setBuffer(buffer);
    hello.setRefDistance(10);
    hello.setLoop(false);
    hello.setVolume(1);
    hello.duration = 0.5;
  });
  audioLoader.load("./sounds/hola.wav", function (buffer) {
    hola.setBuffer(buffer);
    hola.setRefDistance(10);
    hola.setLoop(false);
    hola.setVolume(1);
    hola.duration = 0.5;
  });

  geometry = new THREE.BoxBufferGeometry(2, 2, 2);
  material = new THREE.MeshBasicMaterial({
    map: loader.load("textures/gb.png")
  });
  sphere = new THREE.Mesh(geometry, material);
  geometry = new THREE.BoxBufferGeometry(2, 2, 2);
  material = new THREE.MeshBasicMaterial({
    map: loader.load("textures/spain.png")
  });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(4, 0, 0);
  scene.add(sphere, cube);

  sphere.add(hello);
  cube.add(hola);

  scene.add(gridHelper);

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  let objects = [sphere, cube];
  let intersects = [];

  renderer.domElement.addEventListener("click", onClick);

  function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      selected = intersects[0].object;
      selected.material.color.setHex(0xb8b8b8);
    }
  }

  window.addEventListener("resize", onWindowResize, false);
  play();
}

//function stop() {
//  renderer.setAnimationLoop(null);
//}

function render() {
  renderer.render(scene, camera);
}

function play() {
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function update() {
  orbit.update();
  sphere.rotation.y += 0.005;
  cube.rotation.y += 0.005;
  delta += clock.getDelta();
  if (delta > interval) {
    delta = delta % interval;
  }
}

function onWindowResize() {
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}
