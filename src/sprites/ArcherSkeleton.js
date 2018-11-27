import Skeleton from './Skeleton.js';

export default class ArcherSkeleton extends Skeleton {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.weaponTimer = 200;
  }


  shoot(target) {
    this.anims.play(this.type+'_shoot_'+this.getFacing(), true);
    let dmg = Phaser.Math.Between(1,2) * this.getAttackPower();

    if(!target.isInCombat()) {
      target.setInCombat(true);
    }
    if(Phaser.Math.Between(0, 100) < 34) {
      return;
    } else {
      if(this.willCrit()) {
        let crit = dmg * 2;
        target.setCurrentHp(crit, 'melee')

      } else {
        target.setCurrentHp(dmg, 'melee');
      }
    }

    this.cooldowns.swing = this.weaponTimer;
  };

  update() {
    this.cooldowns.swing--;

    if(this.cooldowns.swing <= 0) {
        this.shoot(this.scene.player);

    } else {
      //this.idle();
    }


  }

}
