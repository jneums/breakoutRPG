import Loot from './Loot.js';


export default class CharacterSheet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.x = x;
    this.y = y;
    this.setTexture(texture);
    this.name = texture;
    this.depth = this.y + 64;
    this.absorbShield = 0;
    this.str;
    this.sta;
    this.agi;
    this.crit;
    this.currentHps = this.getMaxHp();
    this.loot;


    this.nameText = scene.add.text(this.x - 30, this.y - 50);
    this.nameText.setText(this.name).setVisible(false);

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

    //sounds
    this.missMeleeSwing = this.scene.sound.add('miss');
    this.hitMeleeSwing = this.scene.sound.add('clash');
    this.critMeleeSwing = this.scene.sound.add('crit');

    this.on('animationcomplete', function (anim, frame) {
      const type = anim.key.split('_');
      if (type[1] ==='attack' && this.getCurrentTarget()) {
        this.meleeSwing(this.getCurrentTarget());
        this.idle()
      } else if (anim.key === 'combust') {
        this.idle();
        this.setCurrentHp((this.getMaxHp()*.25), 'melee');
        this.cooldowns.swing = this.weaponTimer;

        this.burnSound.play({
          mute: false,
          volume: .3,
          rate: .8,
          detune: 0,
          loop: false,
        })
        this.frostTintIndex = 0;
        this.clearTint();
      } else if (type[1] === 'die') {
        this.lootCreator();
      }
    }, this);

  };

  lootCreator() {
    this.loot = new Loot(this.scene, this.x, this.y);
    this.loot.anims.play('gold', false);
  }



  calculateStats(equipped, stat) {
  //combine all the stat from equipped items
    return Object.keys(equipped)
    .map(child => equipped[child].stats[stat])
    .reduce((acc, item) => acc + item)
  }

  running() {
    this.depth = this.y + 64;
    this.anims.play(this.name + '_run_' + this.getFacing(), true);
  }

  walking() {
    this.depth = this.y + 64;
    this.anims.play(this.name + '_walk_' + this.getFacing(), true);
  }

  idle() {
    this.anims.play(this.name + '_idle_' + this.getFacing(), true);
  }

  die() {
    if (this.name === 'skeleton') {
      this.depth = this.y + 46;
      this.nameText.setVisible(false);
      this.setVelocity(0)
      this.scene.registry.set('targetHps', this)
      if(this.getCurrentTarget()) {
        this.getCurrentTarget().clearCurrentTarget();
        this.clearCurrentTarget();
      }
      this.clearTint();
      this.body.checkCollision.none = true;
      //this.removeInteractive();
      this.setShouldUpdate(false);
    }
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
    let dmg = ((this.equipped.weapon.damage * this.getAttackPower()) + this.equipped.weapon.damage) /60;
    dmg = this.absorbShieldAmt(target, dmg);
    let miss = Phaser.Math.Between(0, 100) < 10;
    if(!target.getCurrentTarget()) {
      target.setCurrentTarget(this);
    }

    if(miss) {
      //miss melee swing
      this.cooldowns.swing = this.weaponTimer;
      return this.missMeleeSwing.play({
        mute: false,
        volume: .3,
        rate: .8,
      });

    } else if(!miss && dmg) {
      if(this.willCrit()) {
        let crit = dmg * 2;
        target.setCurrentHp(crit, 'melee')
        if(this.name === 'knight') {
          console.log('crit: ' + crit);

          this.critMeleeSwing.play({
            mute: false,
            volume: .8,
            rate: 2,
          });
          this.equipped.weapon.stats.crit = 0;
          this.reCalculateStats();
          this.scene.cameras.main.shake(1000, 0.01, true);
          this.gainXp(crit)
        }
      } else {
        this.hitMeleeSwing.play({
          mute: false,
          volume: .3,
          rate: .8,
        });
        target.setCurrentHp(dmg, 'melee');
        if(this.name === 'knight') {
          console.log('dmg: ' + dmg);

          this.gainXp(dmg)
        }
      }
    }
    this.cooldowns.swing = this.weaponTimer;
  };

  willCrit() {
    return Phaser.Math.Between(0,100) < this.crit ? true : false;
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
    if (this.name === 'knight') {
      this.scene.registry.set('targetHps', this.currentTarget)
      this.currentTarget.nameText.setVisible(true);
    }

    //
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
