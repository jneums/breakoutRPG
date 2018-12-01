import CharacterSheet from './CharacterSheet.js';

export default class Skeleton extends CharacterSheet {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);



    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();

    //quick start of inventory system.
    //items will be in very large json
    //and referenced here.
    this.equipped = {
      weapon: {
        name: 'Undead Revenger',
        damage: 50,
        speed: .8,
        value: 1000,
        stats: {
          str: 2,
          agi: 1,
          sta: 6,
          crit: .08,
        },
      },
      armor: {
        slot: 'chest',
        type: 'mail',
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
    this.weaponDmg = this.equipped.weapon.damage;
    this.chanceToMiss = .15;
    this.crit = .15 + this.calculateStats(this.equipped, 'crit');

    this.weaponTimer = this.equipped.weapon.speed * 60;

    this.scene.registry.events.on('changedata', this.updateData, this);
    this.frostTint = [ '0xCEEAFA', '0x75C7FA', '0x57B6F1','0x36A4E8', '0x1187D0', '0x116FA9', '0x0A5888', '0x043F63', '0x01253B' ];
    this.frostTintIndex = -1;

    this.burnSound = this.scene.sound.add('foom');
    this.freezeSound = this.scene.sound.add('freeze');
  };

  updateData(parent, key, data) {
    if(data !== 'destroy') {
      switch (key) {
        case 'red1.png':
          if(this) {

            if(!this.isDead()) {
              this.setCurrentHp((this.getMaxHp()*.25), 'melee');
              this.burnSound.play({
                mute: false,
                volume: .3,
                rate: .8,
                detune: 0,
                loop: false,
              })
              this.anims.play('combust', false)
              this.frostTintIndex = 0;
              this.clearTint();
            }
          }
          break;
          case 'blue1.png':
            this.equipped.weapon.speed += 1;
            this.weaponTimer = this.equipped.weapon.speed * 60
            if(!this.isDead()) {
              this.setTint(this.frostTint[++this.frostTintIndex])
              this.freezeSound.play({
                mute: false,
                volume: .1,
                rate: 2,
                loop: false,
              })
            }
            break;
        default:

      }
    }

  }

  reCalculateStats() {
    var stats = ['str', 'sta', 'agi', 'crit']
    stats.forEach((el) => {
      this[el] = 19 + this.calculateStats(this.equipped, el);
    })
  }

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
