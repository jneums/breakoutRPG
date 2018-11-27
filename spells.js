function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function renameMotions(number) {
  if (number < 204) {
    return 'walk'+ pad(((number-136)/4), 2, 0);
  } else if (number < 248) {
    return 'run'+ pad(((number-204)/4), 2, 0);
  } else if (number < 322) {
    return 'idle'+ pad(((number-270)/4), 2, 0);
  } else if (number < 402) {
    return 'attack'+ pad(((number-330)/4), 2, 0);
  } else {
    return;
  }
}
function reformat(string) {
  let translation;
  translateKeys.forEach((key) => {
    //console.log(translate[key]);
    if(string.includes(translate[key])) {
      translation = 'knight_'+ key +'_'+renameMotions(string.substring(string.length-8,string.length-4))+'.png';
      return translation;
    }
  })
  return translation;

}
var translate = {
  west: 'E_Left',
  northWest: 'F_BackLeft',
  north: 'G_Back',
  northEast: 'H_BackRight',
  east: 'A_right',
  southEast: 'B_F_right',
  south: 'C_Front',
  southWest: 'D_FrontLeft',
}

var translateKeys = Object.keys(translate);


var newFrameArray = [[],[],[]];
for(let i=0; i<3; i++) {
    map.textures[i].frames.filter(key =>'filename').map((child) => {
    child.filename = reformat(child.filename);

    newFrameArray[i].push(child);

      //console.log(child);

  })
}
var sortedAntler = {
  textures: [ Object.assign({}, map.textures[0], { frames: newFrameArray[0]}),
              Object.assign({}, map.textures[1], { frames: newFrameArray[1]}),
              Object.assign({}, map.textures[2], { frames: newFrameArray[2]}),
            ],
  meta: Object.assign({}, map.meta),
};
console.log(sortedAntler);
console.log(JSON.stringify(map));
