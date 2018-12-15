import 'phaser';

import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import BreakOutScene from './scenes/BreakOutScene.js';
import UIScene from './scenes/UIScene.js';
import StartScene from './scenes/StartScene.js';

//config file
var config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
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
