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
    this.load.audio('music', ['./assets/dungeon_ambient_1.mp3', './assets/dungeon_ambient_1.ogg']);
    this.load.audio('block', ['./assets/block_01.mp3', './assets/block_01.ogg']);
    this.load.audio('clash', ['./assets/clash_01.mp3', './assets/clash_01.ogg']);
    this.load.audio('heal', ['./assets/water_01.mp3', './assets/water_01.ogg']);
    this.load.audio('crit', ['./assets/crit_01.mp3', './assets/crit_01.ogg']);
    this.load.audio('absorb', ['./assets/absorb_01.mp3', './assets/absorb_01.ogg']);
    this.load.audio('miss', ['./assets/miss_01.mp3', './assets/miss_01.ogg']);
    this.load.audio('paddle', ['./assets/paddle_01.mp3', './assets/paddle_01.ogg']);
    this.load.audio('foom', ['./assets/foom_0.mp3', './assets/foom_0.ogg']);
    this.load.audio('freeze', ['./assets/freeze.mp3', './assets/freeze.ogg']);
    this.load.atlas('assets', 'assets/breakout.png', 'assets/breakout.json');
    this.load.multiatlas('knight', 'assets/antler-knight.json', 'assets');
    this.load.multiatlas('combust', 'assets/combust.json', 'assets');
    this.load.multiatlas('heal', 'assets/heal.json', 'assets');
    this.load.multiatlas('shield', 'assets/shield.json', 'assets');
    this.load.multiatlas('button', 'assets/button.json', 'assets');
    this.load.json('map', 'assets/isometric-grass-and-water.json');
    this.load.spritesheet('tiles', 'assets/isometric-grass-and-water.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('skeleton', 'assets/skeleton8.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('blades', 'assets/blades.png', { frameWidth: 126, frameHeight: 128 });
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
    this.game.canvas.addEventListener('mousedown', function () {
      game.input.mouse.requestPointerLock();
    });
  }

  updateData(parent, key, data) {
    if(key === 'gameOver') {
      this.scene.stop('BreakOutScene');
      game.input.mouse.releasePointerLock();
    } else if (key === 'combat') {
      this.scene.resume('BreakOutScene');
      this.scene.sendToBack('GameScene')
    } else if (key === 'noCombat') {
      this.scene.pause('BreakOutScene');
      this.scene.sendToBack('BreakOutScene')
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
