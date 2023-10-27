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
    
        // Если есть пересечения, выбираем первое (ближайшее к камере)
        if (intersects.length > 0){
            const obj = intersects[0].object;
            // Click on figure
            if ( obj.parent.figureInstance ) {
                board.deselect();
                board.select(obj.parent.figureInstance);
            // Click on tile with figure
            } else if ( obj.parent.tileInstance && obj.parent.tileInstance.figure ) {
                board.deselect();
                board.select(obj.parent.tileInstance.figure);
            // Click on tile with possible move
            } else if (obj.parent.tileInstance && obj.parent.tileInstance.sphere) {
                board.move( board.selected, obj.parent.tileInstance );
                board.deselect();
            // Click on other objects
            } else if (board.selected) {
                board.deselect();
            }
        // Click on background
        } else if (board.selected) {
            board.deselect();
        }
    }
    
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

export { Stars, clickListen };
