export default class CharacterSheet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.x = x;
    this.y = y;
    this.setTexture(texture);
    this.type = texture;
    this.depth = this.y + 64;
    this.absorbShield = 0;


    scene.add.existing(this);
    scene.physics.add.existing(this);


    this.motion = 'idle';
    this.inCombat = false;
    this.cooldowns = {
      swing: 0,
    }

    this.currentTarget = undefined;

    this.facing = 'south';
    this.shouldUpdate = true;
    this.missMeleeSwing = this.scene.sound.add('miss');
    this.hitMeleeSwing = this.scene.sound.add('clash');
    this.critMeleeSwing = this.scene.sound.add('crit');

  };

  calculateStats(equipped, stat) {
  //combine all the stat from equipped items
    return Object.keys(equipped).map(child => equipped[child].stats[stat])
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
    if(this.getCurrentTarget()) {
      this.getCurrentTarget().clearCurrentTarget();
      this.clearCurrentTarget();
    }
    this.clearTint();
    this.body.checkCollision.none = true;
    //this.removeInteractive();
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

  absorbShieldAmt(target, amt) {
    if(target.absorbShield) {
        target.absorbSound.play({
          mute: false,
          volume: .9,
          rate: 2,
          detune: 0,
          loop: false,
        });
        target.shieldAnchor.anims.play('shield', false);
        target.absorbShield--;
        amt = 0;
    }
    return amt;
  }


  meleeSwing(target) {
    this.anims.play(this.type+'_attack_'+this.getFacing());
    let dmg = ((this.equipped.weapon.damage * this.getAttackPower()) + this.equipped.weapon.damage) /60;
    dmg = this.absorbShieldAmt(target, dmg);
    let miss = Phaser.Math.Between(0, 100) < 34;
    if(!this.getCurrentTarget().getCurrentTarget()) {
      this.getCurrentTarget().setCurrentTarget(this);
    }
    if(!this.getCurrentTarget().isInCombat()) {
      this.getCurrentTarget().setInCombat(true);
    }
    if(miss) {
      //miss melee swing
      this.cooldowns.swing = this.weaponTimer;
      return this.missMeleeSwing.play({
        mute: false,
        volume: .3,
        rate: .8,
        detune: 0,
      });

    } else if(!miss && dmg) {
      if(this.willCrit()) {
        let crit = dmg * 10;
        target.setCurrentHp(crit, 'melee')
        if(this.type === 'knight') {
          this.critMeleeSwing.play({
            mute: false,
            volume: .8,
            rate: 2,
            detune: 0,
            delay: .7,
          });
          this.equipped.weapon.stats.crit = 0;
          this.reCalculateStats();
          this.scene.cameras.main.shake(1000, 0.01, true);
          this.gainXp(crit)
        }
      } else {
        let delay = this.type === 'knight' ? .9 : .5;
        this.hitMeleeSwing.play({
          mute: false,
          volume: .3,
          rate: .8,
          detune: 0,
          delay: delay,
        });
        target.setCurrentHp(dmg, 'melee');
        if(this.type === 'knight') {
          this.gainXp(dmg)
        }
      }
    }

    this.cooldowns.swing = this.weaponTimer;
  };

  willCrit() {
    if(Phaser.Math.Between(0,100) < this.crit) {
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
      if( this.currentHps -= val < 0) {
        this.currentHps = 0;
      }
      this.currentHps -= val;
    } else if (type === 'heal') {
      this.currentHps += val;
    }
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
