import * as THREE from 'three';

import { Stars, clickListen } from '/js/tools.js';
import { Mount, Water, Abyss, Cloud, Fire, Board } from '/js/board.js';
import { Figure } from '/js/figure.js';
import { Button, placeButtonNearEdge } from '/js/menu.js';

// Scene, camera, and renderer setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();


// Dark violet backgound
renderer.setClearColor(0x110011);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls for camera
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
var controls = new OrbitControls( camera, renderer.domElement );

// Animation loop
var animate = function () {
    requestAnimationFrame(animate);
    controls.update(); // Only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
};

animate();

const stars = new Stars(10000, 1000);
scene.add(stars.draw());

const button = new Button(0.01, 0.01, 0.002, 0xAAAA00, 'XYZ');
placeButtonNearEdge(button.model, camera, 0.01, 0.01, 0.12);

const camLight = new THREE.PointLight(0xFFFFFF, 0.1, 1000);
camera.add(camLight);
camera.add(button.model);
scene.add(camera);

const board = new Board(8, 8);
window.board = board;
scene.add(board.model);


// create figures
board.tiles[0][0].addFigure(new Figure());
board.tiles[3][3].addFigure(new Figure());
board.tiles[7][7].addState(new Cloud())
board.tiles[5][5].addState(new Fire());
board.tiles[3][3].addState(new Water());
board.tiles[3][5].addState(new Abyss());
board.tiles[3][0].addState(new Mount());

board.move(board.tiles[3][3].figure, board.tiles[4][4]);

clickListen(board, camera, scene);


// Camera position
camera.position.x = -7;
camera.position.y = 7;
camera.position.z = -7;
camera.lookAt(scene.position);

// Resize on window size change
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    // Обновление размеров камеры
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Обновление размеров рендерера
    renderer.setSize(window.innerWidth, window.innerHeight);
    placeButtonNearEdge(button.model, camera, 0.01, 0.01, 0.12);
}
const light = new THREE.PointLight(0xFFFFFF, 70, 1000);
light.position.set(0, 5, 0);
scene.add(light);

