import * as THREE from 'three';
import { renderHUD } from '/js/menu.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, camera, and renderer setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

// Dark violet backgound
renderer.setClearColor(0x110011);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls for camera
var controls = new OrbitControls( camera, renderer.domElement );
// controls.minDistance = 6;
// controls.maxDistance = 50;

// Animation loop
var animate = function () {
    requestAnimationFrame(animate);
    controls.update(); // Only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
};
animate();

const camLight = new THREE.PointLight(0xFFFFFF, 0.1, 1000);
camera.add(camLight);
scene.add(camera);

// Camera position
camera.position.x = -7;
camera.position.y = 7;
camera.position.z = -7;
camera.lookAt(scene.position);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    // Обновление размеров камеры
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Обновление размеров рендерера
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderHUD();
}

export { scene, camera, renderer, controls };