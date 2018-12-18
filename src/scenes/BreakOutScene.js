export default class BreakOutScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BreakOutScene' });
    this.bricks;
    this.paddle;
    this.ball;
    this.blockHitSound;
    this.paddleHitSound;
    this.width;
    this.height;
  }

  randomBricks() {
    var brickArray = [],
        index = 16 + 1;
    while(--index) {
      brickArray.push(Phaser.Math.Between(0, 5));
    }
    return brickArray;
  }

  brickRandomizer() {
    this.bricks = this.physics.add.staticGroup({
      key: 'abilities',
      frame: this.randomBricks(),
      frameQuantity: 1,
      gridAlign: { width: 8, height: 2, cellWidth: 128, cellHeight: 128, x: 188, y: 128 },
    });

    this.bricks.children.each((brick) => {
      brick.setAlpha(0.4)
      this.registry.set(brick.frame.name + '', brick.frame.name + '');

    });
  }

  create() {
    this.width = this.game.config.width;
    this.height = this.game.config.height;
    this.blockHitSound = this.scene.scene.sound.add('block');
    this.paddleHitSound = this.scene.scene.sound.add('paddle');
    this.physics.world.setBoundsCollision(true, true, true, false);

    this.brickRandomizer();

    this.paddle = this.physics.add.image((this.width / 2), (this.height - 50), 'assets', 'paddle.png').setImmovable();

    this.ball = this.physics.add.image(this.paddle.x, (this.height - 76), 'assets', 'ball.png').setCollideWorldBounds(true).setBounce(1);
    this.registry.set('ballDrop');

    this.ball.setData('onPaddle', true);

    //setColliders
    this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
    this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

    //input events
    this.input.on('pointermove', (pointer) => {
      this.paddle.x += pointer.movementX;

      // Force the sprite to stay on screen
      this.paddle.x = Phaser.Math.Clamp(this.paddle.x, 50, this.width - 50);
      if(this.ball.getData('onPaddle')) {
        this.ball.x = this.paddle.x;
      }
    }, this);

    this.input.on('pointerup', (pointer) => {
      if(this.ball.getData('onPaddle')) {
        this.ball.setVelocity(-75, -420);
        this.ball.setData('onPaddle', false);
      }
    }, this);

  }

  hitBrick(ball, brick) {
    this.paddleHitSound.play({
      mute: false,
      volume: .6,
      rate: .8,
      detune: 0,
      loop: false,
    })
    brick.disableBody(true, true);
    switch (brick.frame.name) {
      case 0:
        this.registry.set('0', '0');
        break;
      case 2:
        this.registry.set('2', '2');
        break;
      case 1:
        this.registry.set('1', '1');
        break;
      case 5:
        this.registry.set('5', '5');
        break;
      case 4:
        this.registry.set('4', '4');
        break;
      case 3:
        this.registry.set('3', '3');
        break;
      default:
    }
    if(this.bricks.countActive() === 0) {
      this.resetLevel();
    }
  }


  resetBall() {
    this.ball.setVelocity(0);
    this.ball.setPosition(this.paddle.x, (this.height - 76));
    this.ball.setData('onPaddle', true);
  }


  resetLevel() {
    this.bricks.children.each((brick) => {
      brick.enableBody(false, 0, 0, true, true);
      brick.setFrame(Phaser.Math.Between(0, 5));
    })
    this.resetBall();

  }


  hitPaddle(ball, paddle) {
    this.blockHitSound.play({
      mute: false,
      volume: .6,
      rate: .8,
      detune: 0,
      loop: false,
    })
    var diff = 0;

    if(ball.x < paddle.x) {
      diff = paddle.x - ball.x;
      ball.setVelocityX(-10 * diff);

    } else if(ball.x > paddle.x) {
      diff = ball.x - paddle.x;
      ball.setVelocityX(10 * diff);

    } else {
      ball.setVelocityX(2 + Math.random() * 10)
    }
  }


  update(time, delta) {
    if(this.ball.y > (this.height)) {
      this.registry.set('ballDrop', this.ball);
      this.resetBall();
    }
  }
};
