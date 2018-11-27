import 'phaser';
import Skeleton from './sprites/Skeleton.js';
import Player from './sprites/Player.js';
import { createAnimations, directionNames, motions } from './animations.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';
import BreakOutScene from './scenes/BreakOutScene.js'



class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    });
  }

  //loading up all assets before starting GameScene
  preload() {
    this.load.multiatlas('knight', 'assets/antler-knight.json', 'assets')
    this.load.json('map', 'assets/isometric-grass-and-water.json');
    this.load.spritesheet('tiles', 'assets/isometric-grass-and-water.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('skeleton', 'assets/skeleton8.png', { frameWidth: 128, frameHeight: 128 });
    this.load.image('house', 'assets/rem_0002.png');
    this.load.image('star', 'assets/star.png');
    this.load.on('complete', () => {
      createAnimations(this);
      this.scene.start('GameScene');
    })
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
        debug: true,
        gravity: { y: 0 }
    }
  },
  scene: [ BootScene, GameScene, BreakOutScene, UIScene ]
};

var game = new Phaser.Game(config);
