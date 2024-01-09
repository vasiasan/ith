import * as THREE from 'three';

import { scene, camera, controls } from '/js/three.js';
import { Stars, clickListen } from '/js/tools.js';
import { Mount, Water, Abyss, Cloud, Fire, Board } from '/js/board.js';
import { Figure } from '/js/figure.js';
import { CameraReset, addHUD } from '/js/menu.js';

const stars = new Stars(10000, 1000);
scene.add(stars.draw());

const cameraReset = new CameraReset(camera, controls);
addHUD(cameraReset.model, camera, 0.01, 0.01);

const board = new Board(8, 8);
window.board = board;
scene.add(board.model);

let players = {
    "vasya": {
        "colors": [
            0x0000FF,
            0xFF0000
        ],
        "mechs": [
            {
                "frame":    { "name": "cube",   "modules": [ true  ] },
                "chassis":  { "name": "wheels", "modules": [ false ] },
                "tools": [
                            {"name": "cannon",  "modules": [ false, false ] },
                            {"name": "cannon",  "modules": [ false, false ] }
                ]
            }
        ]        
    },
    "petya": {
        "colors": [
            0x00FF00,
            0x7F00FF
        ],
        "mechs": [
            {
                "frame":    { "name": "cube",   "modules": [ true  ] },
                "chassis":  { "name": "wheels", "modules": [ false ] },
                "tools": [
                            {"name": "cannon",  "modules": [ false, false ] },
                            {"name": "cannon",  "modules": [ false, false ] }
                ]
            }
        ]        
    }
}

// create figures
board.tiles[0][0].addFigure(new Figure(players["vasya"], players["vasya"].mechs[0]));
board.tiles[2][2].addFigure(new Figure(players["petya"], players["petya"].mechs[0]));
// board.tiles[3][3].addFigure(new Figure());
board.tiles[7][7].addState(new Cloud())
board.tiles[5][5].addState(new Fire());
board.tiles[3][3].addState(new Water());
board.tiles[3][5].addState(new Abyss());
board.tiles[0][1].addState(new Mount());

board.move(board.tiles[0][0].figure, board.tiles[4][4]);

clickListen(board, camera, scene);

// Resize on window size change
const light = new THREE.PointLight(0xFFFFFF, 70, 1000);
light.position.set(0, 5, 0);
scene.add(light);

