import * as THREE from 'three';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import font from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { iconGenerator, materials as mat } from '/js/tools.js';

class Button {
  model = new THREE.Group();
  click(){
    console.log(this);
  }

  constructor(width, height, depth, color, text) {

      this.model.instance = this;
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshStandardMaterial({ color: color });
      this.mesh = new THREE.Mesh(geometry, material);
      
      if (text) {
        const loader = new FontLoader();
        const threeFont = loader.parse(font);
          const textGeometry = new TextGeometry(text, {
              font: threeFont,
              size: width * 0.2,
              height: 0.0001,
          });
          const textMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.position.set(-width / 3, -height / 5, depth / 2);
          this.model.add(textMesh);
      }

      this.model.add(this.mesh);
  }
}

const huds = {};

function addHUD(group, camera, offsetX, offsetY) {
  const distanceFromCamera = 0.1

  const aspectRatio = window.innerWidth / window.innerHeight;
  const vFov = camera.fov * Math.PI / 180;  // Преобразование в радианы
  const viewHeightAtDistance = 2 * Math.tan(vFov / 2) * distanceFromCamera;
  const viewWidthAtDistance = viewHeightAtDistance * aspectRatio;

  // Задаем позицию кнопки с учетом смещений
  // Для отрицательного смещения используем противоположную сторону экрана
  group.position.x = offsetX >= 0 ? (viewWidthAtDistance / 2) - offsetX : -(viewWidthAtDistance / 2) - offsetX;
  group.position.y = offsetY >= 0 ? (viewHeightAtDistance / 2) - offsetY : -(viewHeightAtDistance / 2) - offsetY;
  group.position.z = -distanceFromCamera;
  camera.add(group);
  huds[group.uuid] = [group, camera, offsetX, offsetY];
}

function remHUD(uuid){
  if (huds[uuid]){
    const hud = huds[uuid];
    const group  = hud[0];
    const camera = hud[1];
    camera.remove(group);
    delete huds[uuid];
  }
}

function renderHUD(){
  for (const key in huds){
    const hud = huds[key]
    addHUD(hud[0], hud[1], hud[2], hud[3])
  }
}

export {Button, addHUD, remHUD, renderHUD};