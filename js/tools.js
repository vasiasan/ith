//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
///////////////////////////// STARS //////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

import * as THREE from 'three';

// Background stars
class Stars {
    constructor(amount, distributionRadius) {
        this.starsAmount = amount;
        this.distributionRadius = distributionRadius;
    }
    draw() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsVertices = [];

        for (let i = 0; i < this.starsAmount; i++) {
            const radius = 100 + Math.random() * (this.distributionRadius - 100);
            const theta = Math.random() * 2 * Math.PI; // Угол от 0 до 2π
            const phi = Math.acos(2 * Math.random() - 1); // Угол от 0 до π

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            starsVertices.push(x, y, z);
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 1 });
        return new THREE.Points(starsGeometry, starsMaterial);
    }
}


// Listen Clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function clickListen (board, camera, scene){
    let mouseDownCoords = { x: 0, y: 0 };
    document.addEventListener('mousedown', (event) => {
        mouseDownCoords.x = event.clientX;
        mouseDownCoords.y = event.clientY;
    });
    document.addEventListener('mouseup', onDocumentMouseClick, false);
    
    function onDocumentMouseClick(event) {
        const deltaX = event.clientX - mouseDownCoords.x;
        const deltaY = event.clientY - mouseDownCoords.y;
        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
            return; // Прекратить обработку
        }
    
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
    
        // Находим пересечения со всеми моделями
        let intersects = raycaster.intersectObjects(scene.children, true);

        let clicked = null;
        for (const intersection of intersects) {
            // console.log(intersection);
            const obj = intersection.object;
            if (obj.clickTransparent) continue;
            if (obj.parent.instance && obj.parent.instance.click) {
                obj.parent.instance.click();
                clicked = true;
                break;
            }
        }
        if (!clicked){
            if (board.selected) {
                board.selected.deselect();
            }
        }
    }   
}

const pixelation = (dots, mul) => {
    const model = new THREE.Group();
    for (const dot of dots){
        const pixel = new THREE.Mesh(new THREE.BoxGeometry(dot.h * mul, dot.w * mul, dot.d * mul), dot.material );
        pixel.position.set(dot.x * mul, dot.y * mul, dot.z * mul,);
        model.add( pixel );
    };
    return model;
}

const drawIcon = (frame, dots, size, mul) => {
    const shift = 1/2*mul - size/2;
    const xdots = dots.reverse();

    for (let y in xdots) {
        for (let x in xdots[y]) {
            const material = xdots[y][x];
            if (material) {
                const pixel = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), material);
                pixel.position.set(( parseInt(x)+1 ) * size - shift, ( parseInt(y)+1 ) * size - shift, -size/2);
                frame.add(pixel);
            }
        }
    }
    return frame;
};

const materials = {
    red1:       new THREE.MeshStandardMaterial({ color: 0x110000 }),
    red2:       new THREE.MeshStandardMaterial({ color: 0x220000 }),
    red3:       new THREE.MeshStandardMaterial({ color: 0x330000 }),
    red4:       new THREE.MeshStandardMaterial({ color: 0x440000 }),
    red5:       new THREE.MeshStandardMaterial({ color: 0x550000 }),
    red6:       new THREE.MeshStandardMaterial({ color: 0x660000 }),
    red7:       new THREE.MeshStandardMaterial({ color: 0x770000 }),
    red8:       new THREE.MeshStandardMaterial({ color: 0x880000 }),
    red9:       new THREE.MeshStandardMaterial({ color: 0x990000 }),
    redF:       new THREE.MeshStandardMaterial({ color: 0xAA0000 }),
    redF:       new THREE.MeshStandardMaterial({ color: 0xBB0000 }),
    redF:       new THREE.MeshStandardMaterial({ color: 0xCC0000 }),
    redF:       new THREE.MeshStandardMaterial({ color: 0xDD0000 }),
    redF:       new THREE.MeshStandardMaterial({ color: 0xEE0000 }),
    redF:       new THREE.MeshStandardMaterial({ color: 0xFF0000 }),

    green1:     new THREE.MeshStandardMaterial({ color: 0x001100 }),
    green2:     new THREE.MeshStandardMaterial({ color: 0x002200 }),
    green3:     new THREE.MeshStandardMaterial({ color: 0x003300 }),
    green4:     new THREE.MeshStandardMaterial({ color: 0x004400 }),
    green5:     new THREE.MeshStandardMaterial({ color: 0x005500 }),
    green6:     new THREE.MeshStandardMaterial({ color: 0x006600 }),
    green7:     new THREE.MeshStandardMaterial({ color: 0x007700 }),
    green8:     new THREE.MeshStandardMaterial({ color: 0x008800 }),
    green9:     new THREE.MeshStandardMaterial({ color: 0x009900 }),
    greenA:     new THREE.MeshStandardMaterial({ color: 0x00AA00 }),
    greenB:     new THREE.MeshStandardMaterial({ color: 0x00BB00 }),
    greenC:     new THREE.MeshStandardMaterial({ color: 0x00CC00 }),
    greenD:     new THREE.MeshStandardMaterial({ color: 0x00DD00 }),
    greenE:     new THREE.MeshStandardMaterial({ color: 0x00EE00 }),
    greenF:     new THREE.MeshStandardMaterial({ color: 0x00FF00 }),

    blue1:     new THREE.MeshStandardMaterial({ color: 0x000011 }),
    blue2:     new THREE.MeshStandardMaterial({ color: 0x000022 }),
    blue3:     new THREE.MeshStandardMaterial({ color: 0x000033 }),
    blue4:     new THREE.MeshStandardMaterial({ color: 0x000044 }),
    blue5:     new THREE.MeshStandardMaterial({ color: 0x000055 }),
    blue6:     new THREE.MeshStandardMaterial({ color: 0x000066 }),
    blue7:     new THREE.MeshStandardMaterial({ color: 0x000077 }),
    blue8:     new THREE.MeshStandardMaterial({ color: 0x000088 }),
    blue9:     new THREE.MeshStandardMaterial({ color: 0x000099 }),
    blueA:     new THREE.MeshStandardMaterial({ color: 0x0000AA }),
    blueB:     new THREE.MeshStandardMaterial({ color: 0x0000BB }),
    blueC:     new THREE.MeshStandardMaterial({ color: 0x0000CC }),
    blueD:     new THREE.MeshStandardMaterial({ color: 0x0000DD }),
    blueE:     new THREE.MeshStandardMaterial({ color: 0x0000EE }),
    blueF:     new THREE.MeshStandardMaterial({ color: 0x0000FF }),

    white0:     new THREE.MeshStandardMaterial({ color: 0x000000 }),
    white1:     new THREE.MeshStandardMaterial({ color: 0x111111 }),
    white2:     new THREE.MeshStandardMaterial({ color: 0x222222 }),
    white3:     new THREE.MeshStandardMaterial({ color: 0x333333 }),
    white4:     new THREE.MeshStandardMaterial({ color: 0x444444 }),
    white5:     new THREE.MeshStandardMaterial({ color: 0x555555 }),
    white6:     new THREE.MeshStandardMaterial({ color: 0x666666 }),
    white7:     new THREE.MeshStandardMaterial({ color: 0x777777 }),
    white8:     new THREE.MeshStandardMaterial({ color: 0x888888 }),
    white9:     new THREE.MeshStandardMaterial({ color: 0x999999 }),
    whiteA:     new THREE.MeshStandardMaterial({ color: 0xAAAAAA }),
    whiteB:     new THREE.MeshStandardMaterial({ color: 0xBBBBBB }),
    whiteC:     new THREE.MeshStandardMaterial({ color: 0xCCCCCC }),
    whiteD:     new THREE.MeshStandardMaterial({ color: 0xDDDDDD }),
    whiteE:     new THREE.MeshStandardMaterial({ color: 0xEEEEEE }),
    whiteF:     new THREE.MeshStandardMaterial({ color: 0xFFFFFF }),
}

// Multiplier to make figure smaller or bigger
function iconGenerator (mul, dots) {
    const elem = 1/16
    const hel  = elem/2

    const canvasMaterial    = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });        
    const frameMaterial     = new THREE.MeshStandardMaterial({ color: 0x777777 });

    const frame = [
        { w: 1,    h: 1,    d: elem, x: 0,          y: 0,       z: -hel-elem,material: canvasMaterial}, // background
        { w: elem, h: 1,    d: elem, x: 0,          y: 1/2-hel, z: -hel,     material: frameMaterial }, // frame
        { w: elem, h: 1,    d: elem, x: 0,          y: -1/2+hel,z: -hel,     material: frameMaterial }, // frame
        { w: 1,    h: elem, d: elem, x: 1/2-hel, y: 0,          z: -hel,     material: frameMaterial }, // frame
        { w: 1,    h: elem, d: elem, x: -1/2+hel,y: 0,          z: -hel,     material: frameMaterial }, // frame
    ];

    return drawIcon( pixelation(frame, mul), dots, elem*mul, mul);
}

const cancelIcon = (mul) => {
    const RF = materials.redF;
    const dots = [
                    [ RF,RF, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,RF,RF, ],
                    [ RF,RF,RF, 0, 0, 0, 0, 0, 0, 0, 0,RF,RF,RF, ],
                    [  0,RF,RF,RF, 0, 0, 0, 0, 0, 0,RF,RF,RF, 0, ],
                    [  0, 0,RF,RF,RF, 0, 0, 0, 0,RF,RF,RF, 0, 0, ],
                    [  0, 0, 0,RF,RF,RF, 0, 0,RF,RF,RF, 0, 0, 0, ],
                    [  0, 0, 0, 0,RF,RF,RF,RF,RF,RF, 0, 0, 0, 0, ],
                    [  0, 0, 0, 0, 0,RF,RF,RF,RF, 0, 0, 0, 0, 0, ],
                    [  0, 0, 0, 0, 0,RF,RF,RF,RF, 0, 0, 0, 0, 0, ],
                    [  0, 0, 0, 0,RF,RF,RF,RF,RF,RF, 0, 0, 0, 0, ],
                    [  0, 0, 0,RF,RF,RF, 0, 0,RF,RF,RF, 0, 0, 0, ],
                    [  0, 0,RF,RF,RF, 0, 0, 0, 0,RF,RF,RF, 0, 0, ],
                    [ 0 ,RF,RF,RF, 0, 0, 0, 0, 0, 0,RF,RF,RF, 0, ],
                    [ RF,RF,RF, 0, 0, 0, 0, 0, 0, 0, 0,RF,RF,RF, ],
                    [ RF,RF, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,RF,RF, ],
                ];
    return iconGenerator (mul, dots);
}

function calculateShotPath(startTile, endTile, maxDistance) {
    const path = [];
    let currentTile = startTile;
    path.push(currentTile);
  
    // Вычисляем направление и шаги
    const dx = endTile.x - startTile.x;
    const dz = endTile.z - startTile.z;
    const steps = Math.max(Math.abs(dx), Math.abs(dz));
  
    // Нормализуем шаги
    const stepX = dx / steps;
    const stepZ = dz / steps;
  
    // Определяем направление
    let direction = '';
    let dir = {};
    
    if      (dx > 0) dir.x = 'S';
    else if (dx < 0) dir.x = 'N';
    
    if      (dz > 0) dir.z = 'E';
    else if (dz < 0) dir.z = 'W';

    if      ( Math.abs(dx) === Math.abs(dz) ) direction = `${dir.x}${dir.z}`;
    else if ( Math.abs(dx)  >  Math.abs(dz) ) direction = dir.x;
    else                                      direction = dir.z
  
    console.log(startTile.x, startTile.z, endTile.x, endTile.z, dx, dz, direction);
    for (let i = 1; i <= steps; i++) {
      // Если достигли максимального расстояния выстрела
      if (i > maxDistance) {
        return { finalTile: currentTile, path: path, direction: direction };
      }
  
      // Вычисляем следующую клетку
      const nextX = startTile.x + Math.round(stepX * i);
      const nextZ = startTile.z + Math.round(stepZ * i);
      const nextTile = board.tiles[nextX][nextZ];
  
      // Проверяем, есть ли препятствие
      if (nextTile.obstacle()) {
        return { finalTile: nextTile, path: path, direction: direction };
      }
  
      path.push(nextTile);
      currentTile = nextTile;
  
      // Если достигли конечной клетки
      if (currentTile === endTile) {
        return { finalTile: endTile, path: path, direction: direction };
      }
    }
  
    // Возвращаем последнюю клетку и путь, если конечная клетка не была достигнута
    return { finalTile: currentTile, path: path, direction: direction };
  }
    
// let hoveredObject = null;
// document.addEventListener('mousemove', onDocumentMouseMove);
// function onDocumentMouseMove(event) {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
//     raycaster.setFromCamera(mouse, camera);

//     // Находим пересечения со всеми моделями
//     let intersects = raycaster.intersectObjects(scene.children, true);

//     // Если есть пересечения
//     if (intersects.length > 0) {
//         // Если это новый объект (не тот, над которым был курсор ранее)
//         if (hoveredObject !== intersects[0].object) {
//             if (hoveredObject) {
//                 // Событие "mouseout" для предыдущего объекта
//                 onObjectMouseOut(hoveredObject);
//             }
//             hoveredObject = intersects[0].object;
//             // Событие "mouseover" для нового объекта
//             onObjectMouseOver(hoveredObject);
//         }
//     } else if (hoveredObject) {
//         // Событие "mouseout" для предыдущего объекта
//         onObjectMouseOut(hoveredObject);
//         hoveredObject = null;
//     }
// }

// function onObjectMouseOver(obj) {
//     // Действия при наведении курсора на объект
//     console.log("Mouse over:", obj);
// }

// function onObjectMouseOut(obj) {
//     // Действия при уходе курсора с объекта
//     console.log("Mouse out:", obj);
// }

export { Stars, clickListen, iconGenerator, materials, cancelIcon, calculateShotPath };
