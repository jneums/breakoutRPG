function addRandomSkeleton(scene) {
  skeletons.push(scene.add.existing(new RandomSkeleton(scene)))
}

function changeCameraTarget() {
  if (cameraTarget === skeletons.length-1) {
    cameraTarget = 0;
  }
  cameraTarget++;
  active = skeletons[cameraTarget]
  scene.cameras.main.startFollow(active);
}

function transformCoordsX(x) {
  let newX = x;

  return newX;
};

function transformCoordsY(y) {
  let newY = y;

  return newY;
};
