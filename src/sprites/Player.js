import CharacterSheet from './CharacterSheet.js';

export default class Player extends CharacterSheet {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);

    this.type = 'knight';
    this.depth = this.y + 84;
    this.xp = 0;
    this.healAnchor;
    this.shieldAnchor;

    //add hp event watcher and sync ui with currenthp
    scene.registry.set('playerHps', this.currentHps);
    this.setCurrentHp(0, 'heal');
    scene.registry.set('playerXp', this.xp);
    this.gainXp(1);


    this.gameOver = false;

    this.cooldowns = {
      swing: 0,
    }

    this.weapons = [
      {
        type: 'twoHandedSword',
        name: 'Hand of Justice',
        damage: 102,
        speed: 1.8,
        value: 10000,
        stats: {
          str: 3,
          agi: 2,
          sta: 10,
          crit: 1,
        },
      },
      {
        type: 'twoHandedSword',
        name: 'Hand of Fury',
        damage: 172,
        speed: 2.2,
        value: 20000,
        stats: {
          str: 5,
          agi: 5,
          sta: 100,
          crit: 1,
        },
      },
    ]
    this.equipped = {
      weapon: this.weapons[0],
      armor: {
        slot: 'chest',
        type: 'plate',
        name: 'Plate of the Abyss',
        armor: 10,
        value: 100000,
        stats: {
          str: 4,
          agi: 3,
          sta: 0,
          crit: 1,

        },
      },
    }
    this.str;
    this.sta;
    this.agi;
    this.crit;
    this.reCalculateStats();
    scene.registry.set('crit', this.crit);

    this.changeWeapon(this.weapons[1]);
    this.chanceToMiss = .15;

    this.weaponTimer = this.equipped.weapon.speed * 60;

    this.currentHps = 100;
    this.scene.registry.events.on('changedata', this.updateData, this);

    this.addAnimationAnchor();
    this.healSound = this.scene.sound.add('heal');
    this.absorbSound = this.scene.sound.add('absorb');

  };

  addAnimationAnchor() {
    this.healAnchor = this.scene.add.sprite(this.x, this.y, 'heal', '18.png');
    this.healAnchor.setScale(.60);
    this.healAnchor.depth = this.depth+64;

    this.shieldAnchor = this.scene.add.sprite(this.x, this.y, 'shield', 'b_0016.png')
    this.shieldAnchor.setScale(.25);
    this.shieldAnchor.depth = this.depth+128;

  }

  updateData(parent, key, data) {
    if(data === 'destroy') {
      return;
    } else {
      switch (key) {
        case 'purple1.png':
          this.cooldowns.swing = 0;
          this.reCalculateStats();
          break;
          case 'grey1.png':
            this.absorbShield += 5;
            break;
            case 'yellow1.png':
              this.equipped.weapon.stats.crit += 10;
              this.reCalculateStats();
              break;
              case 'green1.png':
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

  update() {
    if(!this.isDead()) {
      this.cooldowns.swing--;
      if(this.isMoving) {
        this.running();
      } else if(this.isInCombat() && this.getCurrentTarget()) {
        this.setFacing(this.getRadsToCurrentTarget());
        if (Phaser.Math.Distance.Between(this.x, this.y, this.getCurrentTarget().x, this.getCurrentTarget().y) < 100) {
          this.isMoving = false;
          if(this.cooldowns.swing <= 0 && !this.getCurrentTarget().isDead()) {
            this.meleeSwing(this.getCurrentTarget());
          } else if(this.getCurrentTarget().isDead()) {
            this.setInCombat(false);
          }
        }
      } else {
        this.idle();
      }
    } else {
      this.die();
      this.scene.cameras.main.fade(1000, 0,0,0)
      console.log("you died!");;
      this.gameOver = true;
    }
  }
}
