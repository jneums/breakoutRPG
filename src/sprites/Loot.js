export default class Loot extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x, y) {
    super(scene, x, y);
    this.x = x;
    this.y = y;
    this.setTexture('gold', '0');
    this.depth = this.y + 64;
    this.setInteractive({useHandCursor: true})
      .on('pointerup', this.onClick, this)
      .on('pointerover', this.onHover, this)
      .on('pointerout', this.onNotHover, this);

    //TODO loot randomizere
    this.loot = {
      weaponsOrArmor: 'weapons',
      type: 'twoHandedSword',
      name: 'Hand of Fury',
      damage: 172,
      speed: 1.5,
      value: 20000,
      stats: {
        str: 5,
        agi: 5,
        sta: 10,
        crit: 1,
      },
    }

    scene.add.existing(this);
    scene.physics.add.existing(this);

  }

  onClick() {
    let newArray = this.scene.player.inventory.items.weapons.slice();
    newArray.push(this.loot);

    this.scene.player.inventory = {
      gold: (this.scene.player.inventory.gold += Phaser.Math.Between(1, 25)),
      ...this.scene.player.inventory
    }

    this.scene.player.inventory.items = {
      ...this.scene.player.inventory.items,
      weapons: newArray,
    }

    this.setVisible(false).removeInteractive();
    console.log(this.scene.player.inventory);
  }

  onHover() {
    this.setTint('0x000000');
  }

  onNotHover() {
    this.clearTint();
  }


  //return interval
  goingTo(player) {
    return this.loot;
  }
}
