export default class CharacterSheet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.x = x;
    this.y = y;
    this.setTexture(texture);
    this.type = texture;
    this.depth = this.y + 64;
    //TODO fix depth sorting, especially in map creator


    scene.add.existing(this);
    scene.physics.add.existing(this);


    this.motion = 'idle';
    this.speed = 0.15;
    this.inCombat = false;
    this.cooldowns = {
      swing: 0,
    }

    this.currentTarget = undefined;
    this.overkill = 0;
    this.overheal = 0;

    this.facing = 'south';
    this.shouldUpdate = true;

  };

  calculateStats(equipped, stat) {
  //combine all the stat from equipped items
    return Object.keys(equipped).map(el => equipped[el].stats[stat])
                                .reduce((acc, item) => {
                                  return acc + item;
                                })
  }

  running() {
    this.depth = this.y + 64;
    this.anims.play(this.type + '_run_' + this.getFacing(), true);
  }
  walking() {

    this.depth = this.y + 64;
    this.anims.play(this.type + '_walk_' + this.getFacing(), true);
  }

  idle() {
    this.anims.play(this.type + '_idle_' + this.getFacing(), true);
  }

  die() {
    this.depth -= 64;
    this.setVelocity(0)
    this.scene.registry.set('targetHps', 0)
    this.getCurrentTarget().clearCurrentTarget();
    this.clearCurrentTarget();
    this.body.checkCollision.none = true;
    this.disableInteractive();
    this.setShouldUpdate(false);
    //no player die animation yet
    this.anims.play('skeleton' + '_die_' + this.getFacing(), true)
  }

  getRadsToCurrentTarget() {
    if(this.currentTarget) {
      return Phaser.Math.Angle.BetweenY(this.x, this.y, this.currentTarget.x, this.currentTarget.y)
    }
  }

  setShouldUpdate(bool) {
    this.shouldUpdate = bool;
  }

  getShouldUpdate() {
    return this.shouldUpdate;
  }

  getFacing() {
    return this.facing;
  }

  setFacing(rads) {
    //use switch
    if(rads < -2.7475 || rads > 2.7475) {
      this.facing = 'north';
    } else if(rads < 2.7475 && rads > 1.9625) {
      this.facing = 'northEast';
    } else if(rads < 1.9625 && rads > 1.1775) {
      this.facing = 'east';
    } else if(rads < 1.1175 && rads > 0.3925) {
      this.facing = 'southEast';
    } else if(rads < 0.3925 && rads > -0.3925) {
      this.facing = 'south';
    } else if(rads < -0.3925 && rads > -1.1775) {
      this.facing = 'southWest';
    } else if(rads < -1.1775 && rads > -1.9625) {
      this.facing = 'west';
    } else if(rads < -1.9625 && rads > -2.7475) {
      this.facing = 'northWest';
    }
  }

  morphine() {
    let amt = Phaser.Math.Between(1, this.getMaxHp());
    this.setCurrentHp(amt, 'heal');
  }

  crush(target) {
    this.anims.play('attack'+this.getFacing());
    let atp = this.getAttackPower();
    let dmg = Phaser.Math.Between(4, 8) * atp;

    //if the crush cooldown is === 0, crush the target and then reset cooldown
    if(this.cooldowns.crush <= 0) {
      this.getCurrentTarget().setCurrentTarget(this);
      if(!this.getCurrentTarget().isInCombat()) {
        this.getCurrentTarget().setInCombat(true);
      }

      if(this.willCrit()) {
        let crit = dmg * 2;
        target.setCurrentHp(crit, 'melee')

      } else {
        target.setCurrentHp(dmg, 'melee');
      }
    }
    this.cooldowns.crush = 100;
  }

  meleeSwing(target) {
    this.anims.play(this.type+'_attack_'+this.getFacing());
    let dmg = Phaser.Math.Between(1,6) * this.getAttackPower();
    if(!this.getCurrentTarget().getCurrentTarget()) {
      this.getCurrentTarget().setCurrentTarget(this);
    }
    if(!this.getCurrentTarget().isInCombat()) {
      this.getCurrentTarget().setInCombat(true);
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

  willCrit() {
    if(Phaser.Math.Between(0,100) < this.agi) {
      return true;
    } else {
      return false;
    }
  };

  getAttackPower() {
    return this.str / 100;
  };

  getMaxHp() {
    return this.sta;
  };

  getCurrentHps() {
    return this.currentHps;
  };

  setCurrentHp(val, type) {
    if (type === 'melee') {
      console.log('type: melee');
      if( this.currentHps -= val < 0) {
        this.overkill = (val - this.currentHps);
        this.currentHps = 0;
      }
      this.currentHps -= val;
    } else if (type === 'heal') {
      if(this.currentHps += val > this.getMaxHp()) {
        this.overheal = (this.currentHps += val) - this.getMaxHp();
      }
      this.currentHps += val;
    }
  };

  geCurrentLevel() {
    return this.lvl;
  };

  setCurrentTarget(target) {
    this.currentTarget = target;
    //this.currentTarget.setTint('0x7fff0000')
  };

  getCurrentTarget() {
    return this.currentTarget;
  };

  clearCurrentTarget() {
    this.currentTarget = undefined;
  };

  setInCombat(bool) {
    this.inCombat = bool;
  };

  isInCombat() {
    return this.inCombat;
  };

  isDead() {
    if(this.getCurrentHps() <= 0) {
     return true;
   } else {
     return false;
   }
 };

}
