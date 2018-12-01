import 'phaser';
import Skeleton from './sprites/Skeleton.js';
import Player from './sprites/Player.js';
import { createAnimations, directionNames, motions } from './animations.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';
import BreakOutScene from './scenes/BreakOutScene.js'
import StartScene from './scenes/StartScene.js'



class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    });
  }

  //loading up all assets before starting GameScene
  preload() {

    this.load.multiatlas('knight', 'assets/antler-knight.json', 'assets');
    this.load.multiatlas('combust', 'assets/combust.json', 'assets');
    this.load.multiatlas('heal', 'assets/heal.json', 'assets');
    this.load.multiatlas('shield', 'assets/shield.json', 'assets');
    this.load.multiatlas('button', 'assets/button.json', 'assets');
    this.load.json('map', 'assets/isometric-grass-and-water.json');
    this.load.spritesheet('tiles', 'assets/isometric-grass-and-water.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('skeleton', 'assets/skeleton8.png', { frameWidth: 128, frameHeight: 128 });
    this.load.image('house', 'assets/rem_0002.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('background', 'assets/background.png');
    this.load.on('complete', () => {
      createAnimations(this);
      this.scene.start('BreakOutScene');
      this.scene.start('StartScene');
    })
  }

  create() {
    this.registry.events.on('changedata', this.updateData, this);
    // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
    this.game.canvas.addEventListener('mousedown', function () {
      game.input.mouse.requestPointerLock();
    });
  }

  updateData(parent, key, data) {
    if(key === 'gameOver') {
      this.scene.stop('BreakOutScene');
      game.input.mouse.releasePointerLock();


    }
  }
}


//config file
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#ababab',
  parent: 'phaser-example',
  physics: {
    default: 'arcade',
    arcade: {
        debug: false,
        gravity: { y: 0 }
    }
  },
  scene: [ BootScene, GameScene, BreakOutScene, UIScene, StartScene ]
};

var game = new Phaser.Game(config);
