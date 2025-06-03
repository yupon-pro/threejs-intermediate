import * as THREE from "three";

const width = 1024;
const height = 620;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas")
});

renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
camera.position.set(0, 0, +1000);
camera.lookAt(0, 0, 0);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(300),
   new THREE.MeshBasicMaterial({ wireframe: true }));
scene.add(sphere)

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

animate();

function animate() {
  sphere.rotation.y += 0.01;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

onResize();

window.addEventListener("resize", onResize);

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  camera.aspect = width/height;
  camera.updateProjectionMatrix();
}