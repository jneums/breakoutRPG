const Items = {
  weapons: [{
    type: 'twoHandedSword',
    name: 'Hand of Justice',
    damage: 1002,
    speed: 1.8,
    value: 10000,
    stats: {
      str: 3,
      agi: 2,
      sta: 10,
      crit: 1,
    },
  }, {
    type: 'twoHandedSword',
    name: 'Hand of Fury',
    damage: 172,
    speed: 1.5,
    value: 20000,
    stats: {
      str: 5,
      agi: 5,
      sta: 10,
      crit: 1,
    },
  }, {
    name: 'Undead Revenger',
    damage: 105,
    speed: .75,
    value: 1000,
    stats: {
      str: 2,
      agi: 1,
      sta: 6,
      crit: .08,
    }
  }],
  armor: [{
    slot: 'chest',
    type: 'plate',
    name: 'Plate of the Abyss',
    armor: 10,
    value: 100000,
    stats: {
      str: 4,
      agi: 3,
      sta: 20,
      crit: 1,

    },
  }, {
    name: 'Deaths Grasp',
    slot: 'chest',
    type: 'mail',
    armor: 6,
    value: 1000,
    stats: {
      str: 3,
      agi: 2,
      sta: 14,
    },
  }],
}

export default Items;
