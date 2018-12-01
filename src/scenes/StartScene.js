export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene'});

    //this scene needs to have a button that starts the GameScene
    //it needs to have instructions and an explanation
    this.instructionsText;
    this.startButton;

  }

  create() {
    this.background = this.add.image(0, 0, 'background').setOrigin(0);
    this.instructionsText = this.add.image(400, 260, 'button', 'blue_panel_breakoutRPG.png');

    this.startButton = this.add.sprite(400, 520, 'button', 'blue_button00.png')
    this.startButton.setInteractive({useHandCursor: true})
      .on('pointerup', this.onClick, this)
      .on('pointerover', this.onHover, this)
      .on('pointerout', this.onNotHover, this);

  }

  onClick() {
    //start gamescene
    this.startButton.anims.play('button')

    this.scene.start('GameScene');

  }

  onHover() {
    this.startButton.setScale(1.1, 1.1)
  }

  onNotHover() {
    this.startButton.setScale(1, 1)
  }

  update() {

  }

};
