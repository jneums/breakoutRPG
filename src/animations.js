

function createAnimations(scene) {
  let textures = [ 'skeleton' ];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < motions.length; j++) {
      scene.anims.create({
        key: 'skeleton' + '_' + motions[j] + '_' + directionNames[i],
        frames: scene.anims.generateFrameNames('skeleton',
        {
          start: anims[motions[j]].startFrame + directions[directionNames[i]].offset,
          end: anims[motions[j]].endFrame + directions[directionNames[i]].offset,
        }),

        frameRate: anims[motions[j]].frameRate,
        repeat: anims[motions[j]].repeat,
        yoyo: anims[motions[j]].yoyo,
      })
    }
    for (let j = 0; j < knightMotions.length; j++) {
      scene.anims.create({
        key: 'knight' + '_' + knightMotions[j] + '_' + directionNames[i],
        frames: scene.anims.generateFrameNames('knight', {
          start: knightAnims[knightMotions[j]].startFrame,
          end: knightAnims[knightMotions[j]].endFrame,
          zeroPad: 2,
          prefix: 'knight_'+directionNames[i]+'_' + knightMotions[j],
          suffix: '.png',
        }),

        frameRate: anims[motions[j]].frameRate,
        repeat: anims[motions[j]].repeat,
        yoyo: anims[motions[j]].yoyo,
      })
    }
  }
}



var knightAnims = {
  idle: {
    startFrame: 0,
    endFrame: 12,
    frameRate: 3,
    repeat: -1,
    yoyo: true,
  },
  walk: {
    startFrame: 0,
    endFrame: 16,
    frameRate: 8,
    repeat: -1,
  },
  attack: {
    startFrame: 0,
    endFrame: 17,
    frameRate: 20,
    repeat: 0,
  },
  run: {
    startFrame: 0,
    endFrame: 10,
    frameRate: 10,
    repeat: 0,
  },
}


var directions = {
  west: { offset: 0, x: -2, y: 0, opposite: 'east' },
  northWest: { offset: 32, x: -2, y: -1, opposite: 'southEast' },
  north: { offset: 64, x: 0, y: -2, opposite: 'south' },
  northEast: { offset: 96, x: 2, y: -1, opposite: 'southWest' },
  east: { offset: 128, x: 2, y: 0, opposite: 'west' },
  southEast: { offset: 160, x: 2, y: 1, opposite: 'northWest' },
  south: { offset: 192, x: 0, y: 2, opposite: 'north' },
  southWest: { offset: 224, x: -2, y: 1, opposite: 'northEast' },
};

var anims = {
  idle: {
    startFrame: 0,
    endFrame: 3,
    frameRate: 3,
    repeat: -1,
    yoyo: true,

  },
  walk: {
    startFrame: 4,
    endFrame: 11,
    frameRate: 8,
    repeat: -1,
  },
  attack: {
    startFrame: 12,
    endFrame: 19,
    frameRate: 10,
    repeat: 0,
  },
  die: {
    startFrame: 20,
    endFrame: 27,
    frameRate: 10,
    repeat: 0,
  },
  shoot: {
    startFrame: 30,
    endFrame: 31,
    frameRate: 5,
    repeat: 0,
    yoyo: true,
  },
};

var directionNames = Object.keys(directions)
var motions = Object.keys(anims);
var knightMotions = Object.keys(knightAnims);

export { createAnimations, directionNames, motions, sortedAntler };
