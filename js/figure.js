//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
///////////////////////// FIGURE'S PARTS /////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

import * as THREE from 'three';
import { camera } from '/js/three.js';
import { addHUD, remHUD } from '/js/menu.js';
import { iconGenerator, materials as mat } from '/js/tools.js';

// Figure's frame class
frames = {
  "cube": class Frame {
    model = new THREE.Group();
    cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

    live = 2
    modules = [
      {
        "reactors": 1,
        "live": 2
      },
    ]

    constructor(colors, params){
        let modules = params.modules;
        for (const mod in modules){
          this.modules[mod].enable = modules[mod];
        }
        this.cubeMaterial = new THREE.MeshStandardMaterial({color: colors[0]});
        this.cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
        this.cube.position.y = 0.5;

        this.model.add(this.cube);
    }
  }
}

let tools = {
  "cannon": class Cannon {
    toolGeometry = new THREE.BoxGeometry(0.7, 0.2, 0.2);

    damage = 1;
    modules = [
      {
        "reactors": 1,
        "damage": 1
      },
      {
        "reactors": 2,
        "damage": 2
      }
    ];
    click = function () {console.log("CLICK")};
    action = function () {
      
    };
    
    dots = [
      { x: 1, y: 1, material: mat.green },
      { x: 2, y: 1, material: mat.green },
      { x: 3, y: 1, material: mat.green },
      { x: 4, y: 1, material: mat.green },
      { x: 5, y: 1, material: mat.green },
      { x: 1, y: 2, material: mat.green },
      { x: 2, y: 2, material: mat.green },
      { x: 3, y: 2, material: mat.green },
      { x: 4, y: 2, material: mat.green },
      { x: 5, y: 2, material: mat.green },
      { x: 6, y: 2, material: mat.green },
      { x: 1, y: 3, material: mat.green },
      { x: 2, y: 3, material: mat.green },
      { x: 3, y: 3, material: mat.green },
      { x: 4, y: 3, material: mat.green },
      { x: 5, y: 3, material: mat.green },
      { x: 6, y: 3, material: mat.green },
      { x: 7, y: 3, material: mat.green },
      { x: 1, y: 4, material: mat.green },
      { x: 2, y: 4, material: mat.green },
      { x: 3, y: 4, material: mat.green },
      { x: 4, y: 4, material: mat.green },
      { x: 5, y: 4, material: mat.green },
      { x: 6, y: 4, material: mat.green },
      { x: 7, y: 4, material: mat.green },
      { x: 8, y: 4, material: mat.green },
      { x: 1, y: 5, material: mat.green },
      { x: 2, y: 5, material: mat.green },
      { x: 3, y: 5, material: mat.green },
      { x: 4, y: 5, material: mat.green },
      { x: 5, y: 5, material: mat.green },
      { x: 6, y: 5, material: mat.green },
      { x: 7, y: 5, material: mat.green },
      { x: 8, y: 5, material: mat.green },
      { x: 2, y: 6, material: mat.green },
      { x: 3, y: 6, material: mat.green },
      { x: 4, y: 6, material: mat.green },
      { x: 5, y: 6, material: mat.green },
      { x: 6, y: 6, material: mat.green },
      { x: 7, y: 6, material: mat.green },
      { x: 8, y: 6, material: mat.green },
      { x: 9, y: 6, material: mat.green },
      { x: 3, y: 7, material: mat.green },
      { x: 4, y: 7, material: mat.green },
      { x: 5, y: 7, material: mat.green },
      { x: 6, y: 7, material: mat.green },
      { x: 7, y: 7, material: mat.green },
      { x: 8, y: 7, material: mat.green },
      { x: 9, y: 7, material: mat.green },
      { x: 10, y: 7, material: mat.green },
      { x: 4, y: 8, material: mat.green },
      { x: 5, y: 8, material: mat.green },
      { x: 6, y: 8, material: mat.green },
      { x: 7, y: 8, material: mat.green },
      { x: 8, y: 8, material: mat.green },
      { x: 9, y: 8, material: mat.green },
      { x: 10, y: 8, material: mat.green },
      { x: 11, y: 8, material: mat.green },
      { x: 6, y: 9, material: mat.green },
      { x: 7, y: 9, material: mat.green },
      { x: 8, y: 9, material: mat.green },
      { x: 9, y: 9, material: mat.green },
      { x: 7, y: 10, material: mat.green },
      { x: 8, y: 10, material: mat.green },
      { x: 8, y: 11, material: mat.green },
    ];
    
  
    constructor (colors, params){
      this.icon = iconGenerator(0.01, this.dots);
      this.icon.instance = this;
      let modules = params.modules;
      for (const mod in modules){
        this.modules[mod].enable = modules[mod];
      }

      this.toolMaterial = new THREE.MeshStandardMaterial({color: colors[1]});
      this.model = new THREE.Mesh(this.toolGeometry, this.toolMaterial);
    };
  }
}

// Figure's weapon class
class Tools {
  model = new THREE.Group();
  constructor (color, params){
    this.toolLeft  = new tools[params[0].name](color, params);
    this.toolRight = new tools[params[1].name](color, params);
    
    this.toolLeft.model.position.z = -0.35;
    this.toolRight.model.position.z = 0.35;
      
    this.toolLeft.model.position.y  = 0.6;
    this.toolRight.model.position.y = 0.6;

    this.model.add(this.toolLeft.model);
    this.model.add(this.toolRight.model);
  }
}

// Chassis class
let chassis = {
  // Wheel class
  "wheels": class Wheels {

    speed = 3;
    modules = [
      {
        "reactors": 1,
        "speed": 1
      },
    ];
    
    wheelSize = 0.2;
    cellShift = 0.3;
    wheels = [];

    model = new THREE.Group();

    constructor (colors, params){

        class Wheel {
          constructor (color, size){
              this.material = new THREE.MeshStandardMaterial({color: color});
              this.wheelGeometry = new THREE.CylinderGeometry(size, size, 0.3, 32);
              this.model = new THREE.Mesh(this.wheelGeometry, this.material);
              this.model.rotation.x = Math.PI / 2;
          }
        }
  
        for (let i of [+1, -1]) {
            for (let j of [+1, -1]) {
                let wheel = new Wheel(colors[1], this.wheelSize);
                wheel.model.position.x = i * this.cellShift;
                wheel.model.position.z = j * this.cellShift;
                wheel.model.position.y = this.wheelSize;
                this.wheels.push(wheel);
                this.model.add(wheel.model);
            }
        }
    }
  }
};

// Selector for figure
class Selector {
  selectorGeometry = new THREE.ConeGeometry(0.5, 1, 32);
  selectorMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00, transparent: true, opacity: 0.7});
  constructor(){
      this.model = new THREE.Mesh(this.selectorGeometry, this.selectorMaterial);
      this.model.clickTransparent = true;

      this.model.position.y = 2;
      this.model.rotation.x = Math.PI; // Перевернуть конус, чтобы он указывал вниз
  }
};

// Figure's class
class Figure {
  model = new THREE.Group();
  modelFull = new THREE.Group();
  tile = null;
  selector = null;

  constructor (player, mech){
      this.frame = new frames[mech.frame.name](player.colors, mech.frame);
      this.frame.model.instance = this;       // Need to use in click intersections

      this.tools = new Tools(player.colors, mech.tools);
      this.tools.model.instance = this;       // Need to use in click intersections

      this.chassis = new chassis[mech.chassis.name](player.colors, mech.chassis);
      this.chassis.model.instance = this;     // Need to use in click intersections

      this.model.add(this.frame.model);
      this.model.add(this.tools.model);
      this.model.add(this.chassis.model);

      this.modelFull.add(this.model);
  }

  click(){
    if (this.tile.board.selected) {
      this.tile.board.selected.deselect();
    }
    this.select();
  }

  select(){
      // Created to show all UNCLICKABLE objects related to the figure
      this.selector = new Selector();
      this.modelFull.add(this.selector.model);

      this.tile.board.possibleMoves(3, this.tile.x, this.tile.z);
      addHUD(this.tools.toolLeft.icon, camera, -0.01, -0.01);
      addHUD(this.tools.toolRight.icon, camera, 0.01, -0.01);
      // addHUD(this.tools.toolLeft.icon, camera, -0.1, -0.1);
      // addHUD(this.tools.toolRight.icon, camera, 0.1, -0.1);

      this.tile.board.selected = this;
  }
  deselect(){
      this.modelFull.remove(this.selector.model);
      this.selector = null;

      this.tile.board.clearPossibleMoves();
      remHUD(this.tools.toolLeft.icon.uuid);
      remHUD(this.tools.toolRight.icon.uuid);

      this.tile.board.selected = null;
    }
}

export {Figure}

// Fire
// class Fire {
//     model = new THREE.Group();
//     coneGeometry = new THREE.ConeGeometry(0.05, 0.28, 32);
//     yellowMaterial = new THREE.MeshToonMaterial({color: 0xFFFF00,transparent: true,opacity: 0.9});
//     redMaterial = new THREE.MeshToonMaterial({color: 0xFF0000,transparent: true,opacity: 0.9});
//     bottomGeometry = new THREE.SphereGeometry(0.12, 32);

//     constructor(){
//         const flame = new THREE.Group();
//         const cone1 = new THREE.Mesh(this.coneGeometry, this.yellowMaterial);
//         cone1.position.set( 0.048, 0.13,  0.048);
//         const cone2 = new THREE.Mesh(this.coneGeometry, this.yellowMaterial);
//         cone2.position.set(-0.048, 0.13,  0.048);
//         const cone3 = new THREE.Mesh(this.coneGeometry, this.yellowMaterial);
//         cone3.position.set( 0.048, 0.13, -0.048);
//         const cone4 = new THREE.Mesh(this.coneGeometry, this.yellowMaterial);
//         cone4.position.set(-0.048, 0.13, -0.048);
//         const cone5 = new THREE.Mesh(this.coneGeometry, this.redMaterial);
//         cone5.position.set(0, 0.25, 0);

//         const ball = new THREE.Mesh(this.bottomGeometry, this.redMaterial);

//         flame.add(cone1);
//         flame.add(cone2);
//         flame.add(cone3);
//         flame.add(cone4);
//         flame.add(cone5);
//         flame.add(ball);
//         flame.position.x = +0.4;
//         flame.position.z = -0.4;
//         flame.position.y = 0.2;


//         this.model.add(flame);

//         const flame1 = flame.clone() 
//         flame1.position.x = +0.4;
//         flame1.position.z = +0.4;
//         this.model.add(flame1);

//         const flame2 = flame.clone() 
//         flame2.position.x = -0.4;
//         flame2.position.z = +0.4;
//         this.model.add(flame2);

//         const flame3 = flame.clone() 
//         flame3.position.x = -0.4;
//         flame3.position.z = -0.4;
//         this.model.add(flame3);
//     }
// }
