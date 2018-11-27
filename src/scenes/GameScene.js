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
    //invisible object to move toward,
    //stops player when he runs into it
    this.moveTarget;

    this.d = 0;
    this.scene;

  }

  create () {
    this.scene = this.scene.scene
    //spawn skeletons infinitely
    this.skeletonSpawn = this.scene.time.addEvent({
      delay: 50000,
      callback: this.addEnemies,
      callbackScope: this,
      repeat: -1,
    })
    //set up scene
    this.buildMap();
    this.placeHouses();
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

      this.scene.physics.moveToObject(this.player, this.moveTarget, 100);
      this.player.isMoving = true;
    }, this);

    //stop the player at the moveTarget, or at the hitbox of the enemy
    this.physics.add.overlap(this.player, this.moveTarget, function (playerOnMoveTarget) {
      playerOnMoveTarget.isMoving = false;
      playerOnMoveTarget.body.stop();
    }, null, this);

    this.physics.add.overlap(this.skeletons, this.player, function (playerOnEnemy) {
      playerOnEnemy.isMoving = false;
      playerOnEnemy.body.stop()
    }, null, this);

    //some keyboard events, used for testing atm
    this.input.keyboard.on('keydown_SPACE', () => {
      if(this.player.getCurrentTarget()) {
        this.player.crush(this.player.getCurrentTarget())
      }
    });

    this.input.keyboard.on('keydown_ENTER', () => {
      this.player.morphine();
    });

  }

  //building a map
  buildMap () {
    var data = this.scene.cache.json.get('map');

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

        var tile = this.scene.add.image(centerX + tx, centerY + ty, 'tiles', id);

        //keeps map behind objects
        tile.depth = 0;

        i++;
      }
    }
  }

  placeHouses() {
    var house = this.scene.add.image(240, 370, 'house');
    house.depth = house.y + 86;
    house = this.scene.add.image(1300, 290, 'house');
    house.depth = house.y + 86;
  }

  addPlayer() {
    this.player = new Player(this, 800, 364, 'knight')
    this.player.setScale(.50)
    this.player.setCircle(150, 60, 80)
    this.scene.cameras.main.startFollow(this.player).setZoom(1)
  }

  addEnemies() {
    //add enemies
    for(let i = 0; i<4; i++) {
       this.skeletons.push(this.scene.add.existing(new Skeleton(this, Phaser.Math.Between(300,1200), Phaser.Math.Between(100, 500), 'skeleton')));
       this.skeletons[i].setCircle(50, 15, 20)
       this.skeletons[i].on('clicked', clickHandler, this);
       //this.skeletons[i].setCurrentTarget(this.player)
       //this.skeletons[i].setInCombat(true)

     }
    //skeleton emits when clicked
    this.input.on('gameobjectup', function (pointer, gameObject) {
      gameObject.emit('clicked', gameObject);
    }, this);

    //what to do when skeleton emits 'clicked'
    function clickHandler(enemy) {
      this.player.setCurrentTarget(enemy);
      enemy.setCurrentHp(0, 'heal');
      this.player.setInCombat(true);
    };
  }

  update (time, delta) {
    if(this.player.gameOver) {
      return;
    }
    this.skeletons.map((skeleton) => {
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
