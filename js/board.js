import * as THREE from 'three';

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
////////////////////////// BOARD LEGEND //////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
import font from 'three/examples/fonts/helvetiker_regular.typeface.json';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

function placeLetters(board){
    const loader = new FontLoader();
    const threeFont = loader.parse(font);
  

    const textSize = 0.3;
    const textHeight = 0.05;
    const textMaterial = new THREE.MeshBasicMaterial({color: 0x333333});

    // Letters
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    letters.forEach((number, i) => {
        const textGeometry = new TextGeometry(number, {
            font: threeFont,
            size: textSize,
            height: textHeight,
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-4, -0.4, i - 3.75);
        textMesh.rotation.y = Math.PI / -2;
        board.add(textMesh);

        const textMesh2 = new THREE.Mesh(textGeometry, textMaterial);
        textMesh2.position.set(4.05, -0.4, i - 3.75);
        textMesh2.rotation.y = Math.PI / -2;
        board.add(textMesh2);
    });

    // Digits
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
    numbers.forEach((letter, i) => {
        const textGeometry = new TextGeometry(letter, {
            font: threeFont,
            size: textSize,
            height: textHeight,
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(i - 3.75, -0.4, -4.05);
        board.add(textMesh);

        const textMesh2 = new THREE.Mesh(textGeometry, textMaterial);
        textMesh2.position.set(i - 3.75, -0.4, 4);
        board.add(textMesh2);
    });
}


//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
///////////////////////// BOARD AND TILE /////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// Chessboard creation
class Tile {
  model = new THREE.Group();
  board = null;
  figure = null;
  sphere = null;
  shotPreview = null;
  states = [];
  constructor(color, size, x, z){
      this.model.instance = this;
      this.x = x;
      this.z = z;
      this.material = new THREE.MeshToonMaterial({color: color});
      this.geometry = new THREE.BoxGeometry(size, size * 0.6, size);
      this.tile = new THREE.Mesh(this.geometry, this.material)
      this.tile.position.y = -(size * 0.6 / 2);
      this.model.add(this.tile);
  }
  addSphere(type){
      if ( this.sphere ) return;
      this.sphere = new Sphere(type);
      this.model.add(this.sphere);
  }
  removeSphere(){
      this.model.remove(this.sphere);
      this.sphere = null;
  }

  addFigure (figure){
      this.figure = figure;
      this.model.add(figure.modelFull);
      figure.tile = this;
  }

  remFigure (){
      this.model.remove(this.figure.modelFull);
      this.figure.tile = null;
      this.figure = null;
  }

  addState (state){
      this.states.push(state);
      if (state instanceof Water){
          this.material.color.set("#0000FF");
      } else if (state instanceof Abyss){
          this.tile.visible = false;
      } else {
          this.model.add(state.model);
          state.model.instance = this;
          state.tile = this;
      }
  }
  unshootable(){
    return this.figure || (this.states.filter((e) => e instanceof Mount )).length ? true : false ;
  }

  impassable() {
    return this.figure || this.states.some(e => e instanceof Mount || e instanceof Abyss);
  }

  click(){
    if (this.shotPreview){

    }
    if (this.board.selected && this.sphere){
      this.board.move(this.board.selected, this);
      this.board.selected.deselect();
    } else if (this.figure){
      this.figure.click();
    }
  }
}
class Board {
  model = new THREE.Group()

  lightColor = 0xFFFFFF;
  darktColor = 0x000000;

  darkMaterial = new THREE.MeshToonMaterial({color: this.darktColor});

  tileSize = 1;
  tiles = [];

  selected = null;

  constructor(x, z){
      this.xSize = x;
      this.zSize = z;
      this.tileShiftX = x / 2 - this.tileSize / 2; // 3.5 for 8x8 board size and 1 of cell size
      this.tileShiftZ = z / 2 - this.tileSize / 2;

      for (var x = 0; x < this.xSize; x++) {
          for (var z = 0; z < this.zSize; z++) {
              var tileColor = (x + z) % 2 === 0 ? this.darktColor : this.lightColor;
              var tile = new Tile(tileColor, this.tileSize, x, z);

              // create first array element
              if( z === 0 ){ this.tiles[x] = []; };
              this.tiles[x][z] = tile;
              tile.board = this;

              var tileDrawn = tile.model;
              tileDrawn.position.x = x - this.tileShiftX;
              tileDrawn.position.z = z - this.tileShiftZ;
              this.model.add(tileDrawn);
          }
      }
      placeLetters(this.model);
  }

  isWithin (x,z){
      return x >= 0 && x < this.xSize && z >= 0 && z < this.zSize;
  }

  figures (){
      let models = [];
      for (var x = 0; x < this.xSize; x++) {
          for (var z = 0; z < this.zSize; z++) {
              if ( this.tiles[x][z].figure ){
                  models.push(this.tiles[x][z].figure)
              }
          }
      }
      return models;
  }

  move (figure, tile){
      figure.tile.remFigure();
      tile.addFigure(figure);
  }

  tilesWithSphere (){
    let tiles = this.tiles;
    const spheres = []
    for (let x in tiles){
      for (let z in tiles[x]){
        const tile = tiles[x][z];
        if ( tile.sphere ) {
            spheres.push(tile);
        };
      }
    }
    return spheres;
  };

  possibleMoves (steps, x, z){
      let directions = [
          [ x +1, z   ],
          [ x -1, z   ],
          [ x   , z +1],
          [ x   , z -1]
      ];

      if (steps >= 1){
          for ( let [dx, dz] of directions ){
              if ( this.isWithin(dx,dz) && ! this.tiles[dx][dz].impassable() ) {

                  let tile = this.tiles[dx][dz];
                  if ( !tile.sphere && !tile.impassable() ){
                      let sphere = tile.addSphere("move");
                  }
                  this.possibleMoves(steps -1, dx, dz);
              }
          }
      }
  }

  clearPossibleSpheres() {
      this.tilesWithSphere().forEach(tile => tile.removeSphere());
  }
};

class Sphere {
  constructor(type){
      const colors = {move: 0xFF9900, shot: 0xFF0000}
      this.material = new THREE.MeshBasicMaterial({ color: colors[type], transparent: true, opacity: 0.8 });
      this.geometry = new THREE.SphereGeometry(0.1, 16, 16); // Радиус 0.1, сегменты: 16

      this.sphere = new THREE.Mesh(this.geometry, this.material);
      this.sphere.position.y = 0.1; // y = 0.2, чтобы сфера была над доской

      return this.sphere;
  }
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////// STATUSES ////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// Cloud
class Cloud {
  model = new THREE.Group();
  cloudMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
  });

  constructor(){
      this.sphereCount = 50;
      for (let i = 0; i < this.sphereCount; i++) {
          this.sphereGeometry = new THREE.SphereGeometry(Math.random() * 0.4 + 0.01, 16, 16);
          const sphere = new THREE.Mesh(this.sphereGeometry, this.cloudMaterial);
          sphere.position.set(
              Math.random() * 0.6 - 0.3,
              Math.random() * 0.6 - 0.3,
              Math.random() * 0.6 - 0.3
          );
          this.model.add(sphere);
      }
      this.model.position.y = 0.5;;
  }
}

class Fire {
  model = new THREE.Group();
  Geometries = [
      new THREE.ConeGeometry(0.1, 0.2, 32),
      new THREE.ConeGeometry(0.1, 0.3, 32),
      new THREE.ConeGeometry(0.1, 0.5, 32)
  ];

  Materials = [
      new THREE.MeshToonMaterial({color: 0xFFFF00,transparent: true,opacity: 0.9}),   // YELLOW
      new THREE.MeshToonMaterial({color: 0xFF0000,transparent: true,opacity: 0.9})    // RED
  ];

  constructor(){
      let amountOfFlames = 50;
      for (let f = 0; f < amountOfFlames; f++){
          
          const geometry = this.Geometries[ f % this.Geometries.length ];
          const material = this.Materials[ f % this.Materials.length ];

          const flame = new THREE.Mesh(geometry, material);

          flame.position.set(
              Math.random() * 0.8 - 0.4,
              geometry.parameters.height/2,
              Math.random() * 0.8 - 0.4
              )

          this.model.add(flame);
      }
  }
}

// WATER
class Water {}

// Abyss
class Abyss {}

class Mount {
  model = new THREE.Group();

  constructor(){
      // Создаем геометрию конуса
      const radius = 0.707; // радиус основания конуса
      const height = 1; // высота конуса
      const segments = 4; // количество сегментов (для более плавного внешнего вида)

      const geometry = new THREE.ConeGeometry(radius, height, segments);

      // Создаем материалы для горы и снега
      const mountainMaterial = new THREE.MeshStandardMaterial({ color: 0x886633 }); // коричневый для горы
      const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // белый для снега

      // Создаем основную часть горы
      const mountainBase = new THREE.Mesh(geometry, mountainMaterial);
      this.model.add(mountainBase);

      // Добавляем заснеженную вершину. Мы будем использовать меньший конус и размещать его на вершине большого конуса.
      const snowHeight = height * 0.4; // заснеженная часть составляет 20% от высоты горы
      const snowCone = new THREE.Mesh(
          new THREE.ConeGeometry(radius * 0.4001, snowHeight, segments),
          snowMaterial
      );
      snowCone.position.y = (height - snowHeight) / 2; // позиционируем заснеженную вершину на верхней части большого конуса
      this.model.add(snowCone);
      this.model.rotateY(THREE.MathUtils.degToRad(45));
      this.model.position.y = 0.5;
  }
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
////////////////////////// BOARD LEGEND //////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


export { Board, Mount, Water, Abyss, Cloud, Fire };