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
          this.reportFinalScore(data);
          this.registry.events.off('changedata');
          break;
      default:

    }

  }
};
