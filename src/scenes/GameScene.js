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

    this.d = 0;
    this.scene;

  }

  //callback for the 'changedata' event listener
  updateData(parent, key, data) {
    if(key === 'ballDrop') {
      this.addEnemies(1);
    }
  }

  //create function
  create () {
    this.scene = this.scene.scene
    //spawn skeletons infinitely
    this.skeletonSpawn = this.scene.time.addEvent({
      delay: 25000,
      callback: this.addEnemies,
      callbackScope: this,
      repeat: -1,
    })

    this.scene.registry.events.on('changedata', this.updateData, this);
    //set up scene
    this.buildMap();
    this.addPlayer();
    this.addEnemies();

    //stops the skeletons from moving through the player
    this.physics.add.overlap(this.skeletons, this.player, function (playerOnEnemy) {
      playerOnEnemy.isMoving = false;
      playerOnEnemy.body.stop()
    }, null, this);

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


  addPlayer() {
    this.player = new Player(this, 800, 480, 'knight')
    this.player.setScale(.50)
    this.player.setCircle(150, 60, 80)
    this.scene.cameras.main.setScroll(400, 100).setZoom(1.3)
  }

  addEnemies(amt = 5) {
    //add enemies
    for(let i = 0; i < amt; i++) {
       this.skeletons.push(this.scene.add.existing(new Skeleton(this, Phaser.Math.Between(300,1200), Phaser.Math.Between(290, 500), 'skeleton')));
       this.skeletons[i].setCircle(50, 15, 20);
     }
   }

  update (time, delta) {
    if(this.player.gameOver) {
      return this.scene.registry.set('gameOver', this.player.xp);

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
