const Actions = {
  walking() {
    this.depth = this.y + 64;
    this.anims.play(this.name + '_walk_' + this.getFacing(), true);
  },



}

export default Actions;
