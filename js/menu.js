import * as THREE from 'three';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import font from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { iconGenerator, materials as mat } from '/js/tools.js';

class CameraReset {
  constructor(camera, controls) {
      this.click = () => {
          camera.position.set(-7, 7, -7);
    
          controls.target.set(0, 0, 0);
          controls.update();
    
          camera.zoom = 1;
          camera.updateProjectionMatrix();
      };

      const W0 = mat.white5;
      const RF = mat.redF;

      const dots = [
        [  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
        [  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
        [  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
        [  0, 0,W0, 0, 0,RF,W0,W0,W0,W0,W0,W0, 0, 0, ],
        [  0, 0,W0,W0, 0,W0,W0,W0,W0,W0,W0,W0, 0, 0, ],
        [  0, 0,W0,W0,W0,W0,W0,W0,W0,W0,W0,W0, 0, 0, ],
        [  0, 0,W0,W0,W0,W0,W0,W0,W0,W0,W0,W0, 0, 0, ],
        [  0, 0,W0,W0,W0,W0,W0,W0,W0,W0,W0,W0, 0, 0, ],
        [  0, 0,W0,W0,W0,W0,W0,W0,W0,W0,W0,W0, 0, 0, ],
        [  0, 0,W0,W0, 0,W0,W0,W0,W0,W0,W0,W0, 0, 0, ],
        [  0, 0,W0, 0, 0,W0,W0,W0,W0,W0,W0,W0, 0, 0, ],
        [  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
        [  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
        [  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
      ];

      this.model = iconGenerator(0.01, dots);
      this.model.instance = this;
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

export {CameraReset, addHUD, remHUD, renderHUD};