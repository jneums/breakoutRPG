export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: true });
    //player hps
    this.hpText;
    //player xp
    this.xpText;
    //yellow increases crit
    this.crit;


  }
  preload() {
    this.load.audio('music', ['/assets/dungeon_ambient_1.mp3', '/assets/dungeon_ambient_1.ogg']);
    this.load.audio('block', ['/assets/block_01.mp3', '/assets/block_01.ogg']);
    this.load.audio('clash', ['/assets/clash_01.mp3', '/assets/clash_01.ogg']);
    this.load.audio('heal', ['/assets/water_01.mp3', '/assets/water_01.ogg']);
    this.load.audio('crit', ['/assets/crit_01.mp3', '/assets/crit_01.ogg']);
    this.load.audio('absorb', ['/assets/absorb_01.mp3', '/assets/absorb_01.ogg']);
    this.load.audio('miss', ['/assets/miss_01.mp3', '/assets/miss_01.ogg']);
    this.load.audio('paddle', ['/assets/paddle_01.mp3', '/assets/paddle_01.ogg']);
    this.load.audio('foom', ['/assets/foom_0.mp3', '/assets/foom_0.ogg']);
    this.load.audio('freeze', ['/assets/freeze.mp3', '/assets/freeze.ogg']);
  }
  create() {
    this.hpText = this.add.text(30, 10);
    this.xpText = this.add.text(30, 30);
    this.crit = this.add.text(30, 50)
    this.registry.events.on('changedata', this.updateData, this);
    //TODO repeat this for the other three ui elements
  }
  reportFinalScore(score) {
    console.log('Final Score: ' + score.toFixed(0));
  }
  updateData(parent, key, data) {
    switch (key) {
      case 'playerHps':
        this.hpText.setText('HP: ' + Math.round(data));
        break;
      case 'playerXp':
        this.xpText.setText('Score: ' + data.toFixed(0));
        break;
      case 'crit':
        this.crit.setText('Crit: ' + data.toFixed(0) + '%');
        break;
        case 'gameOver':
          this.xpText.setPosition(350, 330);
          this.crit.setText("Game Over!").setPosition(250, 270).setScale(3)
          this.hpText.setText('(reload page to play again!)').setPosition(255, 380);
          this.registry.events.off('changedata');
          this.scene.scene.cameras.main.setBackgroundColor('0x000000')
          this.scene.stop('GameScene')
          break;
      default:

    }

  }
};
