import CharacterSheet from './CharacterSheet.js';
import Items from '../Items.js';

export default class Skeleton extends CharacterSheet {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();
    this.weapon = Items.weapons[2];
    this.armor = Items.armor[1];

    this.equipped = {
      weapon: this.weapon,
      armor: this.armor,
    }

    this.reCalculateStats();

    this.currentHps = this.getMaxHp();
    this.scene.registry.set('targetHps', this)

    this.weaponDmg = this.equipped.weapon.damage;
    this.chanceToMiss = .15;
    this.crit = .15 + this.calculateStats(this.equipped, 'crit');

    this.weaponTimer = this.equipped.weapon.speed * 60;

    this.scene.registry.events.on('changedata', this.updateData, this);
    this.frostTint = [ '0xCEEAFA', '0x75C7FA', '0x57B6F1','0x36A4E8', '0x1187D0', '0x116FA9', '0x0A5888', '0x043F63', '0x01253B' ];
    this.frostTintIndex = -1;

    this.burnSound = this.scene.sound.add('foom');
    this.freezeSound = this.scene.sound.add('freeze');
    this.loot;
  };


  updateData(parent, key, data) {
    if(data !== 'destroy') {
      switch (key) {
        case '4':
          if(this) {
            if(!this.isDead() && Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 75) {
              this.anims.play('combust', false)
            }
          }
          break;
        case '3':
          if(!this.isDead() && Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 75) {
            this.equipped.weapon.speed += (.25 * this.equipped.weapon.speed);
            this.weaponTimer = this.equipped.weapon.speed * 60;
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
      this[el] = this.calculateStats(this.equipped, el);
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
    this.scene.registry.set('targetHps', this)
  };


  update() {
    this.nameText.setPosition(this.x - 34, this.y - 56).depth = this.y + 128;

    this.cooldowns.swing--;

    if(Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 200) {
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
        this.anims.play(this.name+'_attack_'+this.getFacing(), true);
      }
    } else {
      this.idle();
    }
  }
}
