import CharacterSheet from './CharacterSheet.js';

export default class Skeleton extends CharacterSheet {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);



    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();
    this.weaponTimer = 50;

    //quick start of inventory system.
    //items will be in very large json
    //and referenced here.
    this.equipped = {
      weapon: {
        name: 'Undead Revenger',
        dps: 0.8,
        speed: 60,
        value: 1000,
        stats: {
          str: 2,
          agi: 1,
          sta: 6,
          crit: .08,
        },
      },
      armor: {
        name: 'Deaths Grasp',
        armor: 6,
        value: 1000,
        stats: {
          str: 3,
          agi: 2,
          sta: 14,

        },
      }
    }
    this.str = 9 + this.calculateStats(this.equipped, 'str')
    this.sta = 9 + this.calculateStats(this.equipped, 'sta');
    this.agi = 9 + this.calculateStats(this.equipped, 'agi');

    this.currentHps = this.getMaxHp();
    this.weaponDmg = this.equipped.weapon.dps;
    this.chanceToMiss = .15;
    this.chanceToCrit = .15 + this.calculateStats(this.equipped, 'crit');

  };

  moveToAttacker(attacker) {
    this.scene.physics.moveToObject(this, attacker, 100);
  }

  setCurrentHp(val, type) {
    if (type === 'melee') {
      this.currentHps -= val;
    } else if (type === 'heal') {
      this.currentHps += val;
    }
    this.scene.registry.set('targetHps', this.currentHps)
  };


  update() {
    this.cooldowns.swing--;

    if(Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 500) {
      this.setInCombat(true);
      this.setCurrentTarget(this.scene.player);
    }
    if(this.isInCombat() && this.getCurrentTarget()) {
      this.setFacing(this.getRadsToCurrentTarget());
      if(Phaser.Math.Distance.Between(this.x, this.y, this.getCurrentTarget().x, this.getCurrentTarget().y) > 75) {
        this.walking();
        this.moveToAttacker(this.getCurrentTarget());
        this.depth = this.y + 64;
      } else if(Phaser.Math.Distance.Between(this.x, this.y, this.getCurrentTarget().x, this.getCurrentTarget().y) < 75 && this.cooldowns.swing <= 0) {
        this.meleeSwing(this.getCurrentTarget());
      }
    } else {
      this.idle();

    }

  }
}
