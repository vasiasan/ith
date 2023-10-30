//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
///////////////////////// FIGURE'S PARTS /////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

import * as THREE from 'three';

// Figure's frame class
class Frame {
  model = new THREE.Group();
  cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  cubeMaterial = new THREE.MeshStandardMaterial({color: 0x0000FF});

  constructor(){
      this.cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
      this.cube.position.y = 0.5;

      this.model.add(this.cube);
  }
}

// Figure's weapon class
class Tools {
  toolGeometry = new THREE.BoxGeometry(0.7, 0.2, 0.2);
  toolMaterial = new THREE.MeshStandardMaterial({color: 0xFF0000});

  tools = new THREE.Group();
  toolLeft  = new THREE.Mesh(this.toolGeometry, this.toolMaterial);
  toolRight = new THREE.Mesh(this.toolGeometry, this.toolMaterial);

  constructor (){
      this.toolLeft.position.z = -0.35;
      this.toolLeft.position.y = 0.6;

      this.toolRight.position.z = 0.35;
      this.toolRight.position.y = 0.6;

      this.tools.add(this.toolLeft);
      this.tools.add(this.toolRight);
      this.model = this.tools
  }
}

// Wheel class
class Wheel {
  material = new THREE.MeshStandardMaterial({color: 0xff00ff});

  constructor (size){
      this.wheelGeometry = new THREE.CylinderGeometry(size, size, 0.3, 32);
      this.wheel = new THREE.Mesh(this.wheelGeometry, this.material);
      this.wheel.rotation.x = Math.PI / 2;
      this.model = this.wheel;
  }
}

// Chassis class
class Chassis {

  wheelSize = 0.2;
  cellShift = 0.3;
  wheels = [];

  chassis = new THREE.Group();

  constructor (){
      
      for (let i of [+1, -1]) {
          for (let j of [+1, -1]) {
              let wheel = new Wheel(this.wheelSize);
              wheel.model.position.x = i * this.cellShift;
              wheel.model.position.z = j * this.cellShift;
              wheel.model.position.y = this.wheelSize;
              this.wheels.push(wheel);
              this.chassis.add(wheel.model);
          }
      }
      this.model = this.chassis;
  }
}

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
}
// Figure's class
class Figure {
  model = new THREE.Group();
  modelFull = new THREE.Group();
  tile = null;
  selector = null;

  constructor (){
      this.frame = new Frame();
      this.frame.model.instance = this;       // Need to use in click intersections

      this.tools = new Tools();
      this.tools.model.instance = this;       // Need to use in click intersections

      this.chassis = new Chassis();
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

      this.tile.board.selected = this;    
  }
  deselect(){
      this.modelFull.remove(this.selector.model);
      this.selector = null;

      this.tile.board.clearPossibleMoves();

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
