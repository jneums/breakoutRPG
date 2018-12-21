import CharacterSheet from './CharacterSheet.js';
import Items from '../Items.js';

export default class Player extends CharacterSheet {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);

    this.depth = this.y + 96;
    this.xp = 0;
    this.healAnchor;
    this.shieldAnchor;

    this.gameOver = false;

    this.inventory = {
      gold: 0,
      items:{
        weapons: [Items.weapons[0]],
        armor: [Items.armor[0]],
      }
    }

    this.equipped = {
      weapon: this.inventory.items.weapons[0],
      armor: this.inventory.items.armor[0],
    }

    this.reCalculateStats();
    scene.registry.set('crit', this.crit);

    this.currentHps = this.getMaxHp();
    //add hp event watcher and sync ui with currenthp
    scene.registry.set('playerHps', this.currentHps);
    this.setCurrentHp(0, 'heal');
    scene.registry.set('playerXp', this.xp);
    this.gainXp(1);

    this.chanceToMiss = .15;

    this.scene.registry.events.on('changedata', this.updateData, this);

    this.addAnimationAnchor();
    this.healSound = this.scene.sound.add('heal');
    this.absorbSound = this.scene.sound.add('absorb');

  };

  addAnimationAnchor() {
    this.healAnchor = this.scene.add.sprite(this.x, this.y, 'heal', '18');
    this.healAnchor.setScale(.60);
    this.healAnchor.depth = this.depth+128;

    this.shieldAnchor = this.scene.add.sprite(this.x, this.y, 'shield', 'b_0016')
    this.shieldAnchor.setScale(.25);
    this.shieldAnchor.depth = this.depth+128;
  }

  updateData(parent, key, data) {
    if(data === 'destroy') {
      return;
    } else {
      switch (key) {
        case '0':
          if (this.getCurrentTarget()) {
            this.anims.play(this.name+'_attack_'+this.getFacing(), true);
          }
          break;
        case '5':
          this.absorbShield += 1;
          break;
        case '1':
          this.equipped.weapon.stats.crit += 10;
          this.reCalculateStats();
          break;
        case '2':
          this.healSound.play({
            mute: false,
            volume: .9,
            rate: 1.5,
            detune: 0,
            loop: false,
          })
          this.healAnchor.anims.play('heal', false)
          this.setCurrentHp(20, 'heal')
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
    this.scene.registry.set('meleeDps', ((this.equipped.weapon.damage * this.getAttackPower()) + this.equipped.weapon.damage) /60)
    this.scene.registry.set('crit', this.crit)
  }

  changeWeapon(weapon) {
    this.equipped.weapon = Object.assign(weapon);
    this.reCalculateStats();
  }

  gainXp(amt) {
    this.xp += amt;
    this.scene.registry.set('playerXp', this.xp);
  }

  //shadow the setCurrentHp in the CharacterSheet class
  setCurrentHp(val, type) {
    if (type === 'melee') {
      this.currentHps -= val;
    } else if (type === 'heal') {
      this.currentHps + val > this.getMaxHp()
      ? this.currentHps = this.getMaxHp()
      : this.currentHps += val;
    }
    this.scene.registry.set('playerHps', this.currentHps)
  };

  enemyInRange() {
    const enemies = this.scene.skeletons.map((skeleton) => {
      return (!skeleton.isDead() && Phaser.Math.Distance.Between(this.x, this.y, skeleton.x, skeleton.y) < 125);
    });
    if (enemies.includes(true)) {
      this.setInCombat(true)
    } else {
      this.setInCombat(false)
    }
  }

  update() {
    //keep the animations on top of moving player
    this.healAnchor.depth = this.depth + 2;
    this.healAnchor.setPosition(this.x, this.y)
    this.shieldAnchor.depth = this.depth + 2;
    this.shieldAnchor.setPosition(this.x, this.y)
    this.nameText.setPosition(this.x - 28, this.y - 56).depth = this.y + 128;
    if (!this.isDead()) {
      this.enemyInRange();
      if(this.isMoving) {
        this.running();
      } else if (this.isInCombat() && this.getCurrentTarget()) {
        this.setFacing(this.getRadsToCurrentTarget());
        if (Phaser.Math.Distance.Between(this.x, this.y, this.getCurrentTarget().x, this.getCurrentTarget().y) < 100) {
          this.isMoving = false;
        }
      } else {
        this.idle();
      }
    } else {
      this.die();
      console.log("you died!");
      this.gameOver = true;

    }
  }
}
