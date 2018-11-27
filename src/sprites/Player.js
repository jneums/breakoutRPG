import CharacterSheet from './CharacterSheet.js';

export default class Player extends CharacterSheet {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);

    this.type = 'knight';
    this.depth = this.y + 84

    //add hp event watcher and sync ui with currenthp
    scene.registry.set('playerHps', this.currentHps);
    this.setCurrentHp(0, 'heal');

    this.gameOver = false;

    this.cooldowns = {
      swing: 0,
      crush: 0,
    }

    this.equipped = {
      weapon: {
        equipped: true,
        type: 'twoHandedSword',
        name: 'Hand of Justice',
        dps: 1.2,
        speed: 1.8,
        value: 10000,
        stats: {
          str: 3,
          agi: 2,
          sta: 10,
          crit: .05,
        },
      },
      armor: {
        equipped: true,
        slot: 'chest',
        type: 'plate',
        name: 'Plate of the Abyss',
        armor: 10,
        value: 100000,
        stats: {
          str: 4,
          agi: 3,
          sta: 15,

        },
      },
    }
    this.str = 19 + this.calculateStats(this.equipped, 'str')
    this.sta = 19 + this.calculateStats(this.equipped, 'sta');
    this.agi = 19 + this.calculateStats(this.equipped, 'agi');
    this.weaponDmg = this.equipped.weapon.dps;
    this.chanceToMiss = .15;
    this.chanceToCrit = .15 + this.calculateStats(this.equipped, 'crit');
    this.weaponTimer = this.equipped.weapon.speed * 60;

    this.currentHps = 1000;
  };


  //shadow the setCurrentHp in the CharacterSheet class
  setCurrentHp(val, type) {
    if (type === 'melee') {
      this.currentHps -= val;
    } else if (type === 'heal') {
      this.currentHps += val;
    }
    this.scene.registry.set('playerHps', this.currentHps)
  };

  update() {
    if(!this.isDead()) {
      this.cooldowns.swing--;
      this.cooldowns.crush--;
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
        if(this.getCurrentHps() < this.getMaxHp())
        this.setCurrentHp(.0009, 'heal')
      }
    } else {
      this.die();
      this.scene.cameras.main.fade(1000, 0,0,0)
      console.log("you died");
      this.gameOver = true;
    }
  }
}
