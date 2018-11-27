export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: true });
    //what do we want on the ui?
    //self frame with: hp indicator, lvl, xp
    this.lvlText;
    this.xpText;
    this.hpText;
    this.targetHpText;
    //target frame with hp indicator, lvl
    //action bar for abilities

  }
  create() {
    this.hpText = this.add.text(0, 0);
    this.targetHpText = this.add.text(100, 0);
    this.registry.events.on('changedata', this.updateData, this);
    //TODO repeat this for the other three ui elements
  }

  updateData(parent, key, data) {
    if(key === 'playerHps') {
      this.hpText.setText('HP: ' + Math.round(data*10));
    } else if (key === 'targetHps') {
      this.targetHpText.setText('Enemy HP: ' + Math.round(data*10));
    }
  }
};
