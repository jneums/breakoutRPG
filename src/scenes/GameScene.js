import Skeleton from '../sprites/Skeleton.js';
import ArcherSkeleton from '../sprites/ArcherSkeleton.js';
import Player from '../sprites/Player.js';



export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    //half of the tile width for isometric measurements
    this.tileWidthHalf;
    this.tileHeightHalf;
    //player object
    this.player;
    //array of enemies
    this.skeletons = [];
    //object used as movement bullseye
    this.moveTarget;

    this.d = 0;
    this.backgroundMusic;
    //number to countdown until new spawns
    this.enemyTimer = 3000;
  }

  //callback for the 'changedata' event listener
  updateData(parent, key, data) {
    if(key === 'ballDrop') {
      //on ball drop, what should punishment be?
    }
  }

  //create function
  create () {
    this.backgroundMusic = this.sound.add('music');

    this.backgroundMusic.play({
      mute: false,
      volume: .9,
      rate: 1,
      loop: true,
    })

    //set up scene
    this.buildMap();
    this.addPlayer();
    this.addEnemies();

    //set up click to move target
    this.moveTarget = this.physics.add.image(25, 25, 'star');
    this.moveTarget.setCircle(20, 0, -5).setVisible(false).setScale(.75);

    //move target and start moving toward new pos
    this.input.on('pointerdown', function (pointer) {
      //scroll plus pointer.x to compensate for follow cam cooords
      let pointerPlusScrollX = pointer.x+this.cameras.cameras[0].scrollX;
      let pointerPlusScrollY = pointer.y+this.cameras.cameras[0].scrollY;
      let angle = Phaser.Math.Angle.BetweenY(this.player.x, this.player.y, pointerPlusScrollX, pointerPlusScrollY);

      this.player.setFacing(angle);
      this.moveTarget.setPosition(pointerPlusScrollX, pointerPlusScrollY )

      this.physics.moveToObject(this.player, this.moveTarget, 100);
      this.player.isMoving = true;
    }, this);

    //stop the player at the moveTarget, or at the hitbox of the enemy
    this.physics.add.overlap(this.player, this.moveTarget, function (playerOnMoveTarget) {
      playerOnMoveTarget.isMoving = false;
      playerOnMoveTarget.body.stop();
    }, null, this);

    //stops the skeletons from moving through the player
    this.physics.add.overlap(this.skeletons, this.player, function (playerOnEnemy) {
      playerOnEnemy.isMoving = false;
      this.player.isMoving = false;
      this.player.body.stop()
      playerOnEnemy.body.stop()
     //maybe get player to stop moving here
    }, null, this);


  }

  //building a map
  buildMap () {
    var data = this.cache.json.get('map');

    var tilewidth = data.tilewidth;
    var tileheight = data.tileheight;

    this.tileWidthHalf = tilewidth / 2;
    this.tileHeightHalf = tileheight / 2;

    var layer = data.layers[0].data;

    var mapwidth = data.layers[0].width;
    var mapheight = data.layers[0].height;

    var centerX = mapwidth * this.tileWidthHalf;
    var centerY = 16;

    var i = 0;

    for (let y = 0; y < mapheight; y++) {
      for (let x = 0; x < mapwidth; x++) {
        var id = layer[i] - 1;

        var tx = (x - y) * this.tileWidthHalf;
        var ty = (x + y) * this.tileHeightHalf;

        var tile = this.add.image(centerX + tx, centerY + ty, 'tiles', id);

        //keeps map behind objects
        tile.depth = 0;

        i++;
      }
    }
  }


  addPlayer() {
    this.player = new Player(this, 800, 480, 'knight')
    this.player.setScale(.50)
    this.player.setCircle(50, 160, 180)
    this.cameras.main.startFollow(this.player, false, .5, .5, 0, 50).setZoom(1.5)

  }

  addEnemies(amt = 2) {
    let index = -1;
    //add enemies
    while (++index < amt) {
       this.skeletons.push(this.add.existing(new Skeleton(this, Phaser.Math.Between(300,1200), Phaser.Math.Between(290, 500), 'skeleton')));
       this.skeletons[index].setCircle(30, 50, 50);
     }
   }

  update (time, delta) {
    this.enemyTimer--;
    //spawn enemies
    if (this.enemyTimer <= 0) {
      this.addEnemies(1);
      this.enemyTimer = Phaser.Math.Between(2000, 5000);
    }
    //check for game over and emit gameover to ui
    if (this.player.gameOver) {
      return this.registry.set('gameOver', this.player.xp);
    }

    // which scene to show in front while in combat
    if(this.player.isInCombat()) {
      this.registry.set('combat', this.player.xp);
      this.input.enabled = false;

    // which scene to show when not in combat
    } else if (!this.player.isInCombat()){
      this.registry.set('noCombat', this.player.xp);
      this.input.enabled = true;
    }

    // update all the actors
    this.skeletons.forEach((skeleton) => {
      if(skeleton.getShouldUpdate()) {
        if(skeleton.isDead()) {
          skeleton.die();
        } else {
          skeleton.update();
        }
      }
    })
    this.player.update();

  }
}
