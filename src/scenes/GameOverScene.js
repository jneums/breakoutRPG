export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene', active: false });



  }
  create() {
    this.gameOverText = this.add.text(800, 350);
    this.gameOverText.setText('Game Over');


  }

};
