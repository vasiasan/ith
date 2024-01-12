//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
///////////////////////// FIGURE'S PARTS /////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

import * as THREE from 'three';
import { camera } from '/js/three.js';
import { addHUD, remHUD } from '/js/menu.js';
import { iconGenerator, materials as mat, cancelIcon, calculateShotPath } from '/js/tools.js';

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
    cancelIcon = cancelIcon(0.01);

    actCalc = function(){
      let tiles = this.figure.tile.board.tiles;
      for (let x in tiles){
        for (let z in tiles[x]){
          const tile = tiles[x][z];
          if ( this.figure.tile === tile ){
            continue;
          }
          const shot = calculateShotPath( this.figure.tile, {x: +x, z: +z}, tiles); // +z +x mean convert to int

          // console.log(x,z, shot.map(a => a.x + ":" + a.z))
          if (shot.at(-1) === tile){

            let mark = new Mark("shot")
            mark.action = () => {
              this.figure.tile.board.clearMarks();
              this.actCalc();
              for(let tile of shot.slice(1)){
                tile.removeMark();
                if (tile === shot.at(-1) && tile.unshootable()){
                  let shotEnd = new Mark("shotEnd");
                  shotEnd.action = () => {
                    console.log(this);
                  }
                  tile.addMark(shotEnd);  
                } else {
                  let shotPath = new Mark("shotPath");
                  shotPath.action = () => {
                    console.log(this);
                  }
                  tile.addMark(shotPath);  
                }
              }
            };
            tile.addMark(mark);
          }          
        }
      }
    };

    cancelAiming () {
      this.figure.deselect();
      this.figure.select();
      this.click = this.aiming;
    };

    // Show close icon
    aiming () {
      remHUD(this.icon.uuid);
      addHUD(this.cancelIcon, camera, this.iconX, this.iconY);
      this.figure.tile.board.clearMarks();
      this.actCalc();
      this.click = this.cancelAiming
    };

    showHUD = function (x, y) {
      this.iconX = x;
      this.iconY = y;
      addHUD(this.icon, camera, x, y);
      this.click = this.aiming;
    }
    hideHUD = function () {
      remHUD(this.icon.uuid);
      remHUD(this.cancelIcon.uuid);
    }
    
    constructor (colors, params){
      const GD = mat.greenD;
      const GF = mat.greenF;
      const G7 = mat.green7;
      const G5 = mat.green5;
      const G3 = mat.green3;
      const dots = [
                      [  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                      [  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                      [  0, 0, 0, 0, 0, 0, 0, 0,GF, 0, 0, 0, 0, 0, ],
                      [  0, 0, 0, 0, 0, 0, 0,GF,GD,GD, 0, 0, 0, 0, ],
                      [  0, 0, 0, 0, 0, 0,GF,GD,GD,GD,G7, 0, 0, 0, ],
                      [  0, 0, 0, 0, 0,GF,GD,GD,GD,G7,G5,G3, 0, 0, ],
                      [  0, 0, 0, 0,GF,GD,GD,GD,G7,G5,G3, 0, 0, 0, ],
                      [  0, 0,GF,GF,GD,GD,GD,G7,G5,G3, 0, 0, 0, 0, ],
                      [  0,GF,GF,GD,GD,GD,G7,G5,G3, 0, 0, 0, 0, 0, ],
                      [ GF,GF,GD,GD,GD,G7,G5,G3, 0, 0, 0, 0, 0, 0, ],
                      [ GF,GD,GD,GD,G7,G5,G3, 0, 0, 0, 0, 0, 0, 0, ],
                      [ GD,GD,GD,G7,G5,G3,G3, 0, 0, 0, 0, 0, 0, 0, ],
                      [ GD,GD,G7,G5,G3,G3, 0, 0, 0, 0, 0, 0, 0, 0, ],
                      [ GD,G7,G5,G3,G3, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                    ];
  
      this.icon = iconGenerator(0.01, dots);
      this.icon.instance = this;
      this.cancelIcon.instance = this;
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
  constructor (figure, color, params){
    this.toolLeft  = new tools[params[0].name](color, params);
    this.toolRight = new tools[params[1].name](color, params);
    
    this.showHUD = function () {
      params[0] ? this.toolLeft.showHUD(-0.01, -0.01) :null ;
      params[1] ? this.toolRight.showHUD(0.01, -0.01) :null ;
    }
    this.hideHUD = function () {
      params[0] ? this.toolLeft.hideHUD()  :null ;
      params[1] ? this.toolRight.hideHUD() :null ;
    }
  
    this.toolLeft.figure  = figure;
    this.toolRight.figure = figure;

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

    speed = 10;
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

      this.tools = new Tools(this, player.colors, mech.tools);
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

  possibleMoves (steps, x, z){
      let directions = [
          [ x +1, z   ],
          [ x -1, z   ],
          [ x   , z +1],
          [ x   , z -1]
      ];

      let tiles = this.tile.board.tiles;
      if (steps >= 1){
          for ( let [dx, dz] of directions ){
              if ( this.tile.board.isWithin(dx,dz) && ! tiles[dx][dz].impassable() ) {

                  let tile = tiles[dx][dz];
                  if ( !tile.mark && !tile.impassable() ){
                      let mark = new Mark("move")
                      mark.action = () => {
                                          this.move(tile);
                                          this.tile.board.selected.deselect()
                                        };
                      tile.addMark(mark);
                  }
                  this.possibleMoves(steps -1, dx, dz);
              }
          }
      }
  }

  move (tile){
    this.tile.remFigure();
    tile.addFigure(this);
  }

  select(){
      // Created to show all UNCLICKABLE objects related to the figure
      this.selector = new Selector();
      this.modelFull.add(this.selector.model);

      this.possibleMoves(this.chassis.speed, this.tile.x, this.tile.z);
      this.tools.showHUD();

      this.tile.board.selected = this;
  }
  deselect(){
      this.modelFull.remove(this.selector.model);
      this.selector = null;

      this.tile.board.clearMarks();
      this.tools.hideHUD();

      this.tile.board.selected = null;
    }
}

class Mark {
  constructor(type){
      const types = {
                        move: {
                            color: 0xFF9900,
                            radius: 0.1,
                            height: 0.1
                        },
                        shot: {
                            color: 0xFF0000,
                            radius: 0.1,
                            height: 0.3
                        },
                        shotPath: {
                            color: 0xFF0000,
                            radius: 0.3,
                            height: 0.3
                        },
                        shotEnd: {
                            color: 0xFF0000,
                            radius: 0.5,
                            height: 0.5
                        }
                    };
      const mark = types[type];
      this.material = new THREE.MeshBasicMaterial({ color: mark.color, transparent: true, opacity: 0.8 });
      const radius = {move: 0.1, shot: 0.1, shotPath: 0.3}
      this.geometry = new THREE.SphereGeometry(mark.radius, 16, 16); // Радиус 0.1, сегменты: 16

      this.mark = new THREE.Mesh(this.geometry, this.material);
      this.mark.position.y = mark.height; // y = 0.2, чтобы сфера была над доской
      this.mark.type = type;

      return this.mark;
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
