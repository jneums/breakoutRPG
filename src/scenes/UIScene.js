export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: true });
    //player hps
    this.hpText;
    //player current lvl
    this.lvlText;
    //player xp
    this.xpText;
    //current targets hps
    this.targetHpText;
    //weapon power and level increase meleeDps
    this.meleeDps;
    //yellow increases crit
    this.crit;


  }
  create() {
    this.hpText = this.add.text(30, 0);
    this.targetHpText = this.add.text(640, 0);
    this.lvlText = this.add.text(30, 20);
    this.xpText = this.add.text(30, 40);
    this.meleeDps = this.add.text(30, 60);
    this.crit = this.add.text(130, 60)
    this.registry.events.on('changedata', this.updateData, this);
    //TODO repeat this for the other three ui elements
  }

  updateData(parent, key, data) {
    switch (key) {
      case 'playerHps':
        this.hpText.setText('HP: ' + Math.round(data));
        break;
      case 'targetHps':
        this.targetHpText.setText('Enemy HP: ' + Math.round(data));
        break;
      case 'playerLvl':
        this.lvlText.setText('Hero Level: ' + data);
        break;
      case 'playerXp':
        this.xpText.setText('XP: ' + data.toFixed(0));
        break;
      case 'meleeDps':
        this.meleeDps.setText('DPS: ' + data.toFixed(2));
        break;
      case 'crit':
        this.crit.setText('Crit: ' + data.toFixed(0) + '%');
        break;
      default:

    }

  }
};
