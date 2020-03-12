import Phaser from "phaser";

import "./assets/scss/index.scss";
// const docElement = document.documentElement;
// const width = docElement.clientWidth;
// const height = docElement.clientHeight;
var config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    // mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 375,
    height: 667
    // min: {
    //   width: 800,
    //   height: 600
    // },
    // max: {
    //   width: 1600,
    //   height: 1200
    // }
  },
  scene: {
    init: init,
    preload: preload,
    create: create,
    update: update
  }
};
let WIDTH: number, HEIGHT: number;
var game = new Phaser.Game(config);
var ROWS: number, COLS: number;
var GEM_SIZE = 70,
  MIN_CLEAR = 3;
var SCALE = 0.6;
var GEM_WIDTH = GEM_SIZE * SCALE;
var gems: { create: (arg0: number, arg1: number, arg2: string) => any };
var selectGem = null,
  nextGem = null,
  afterCanClear = false;
var startXY = { x: 0, y: 0 };
var waitKill_V = [],
  waitKill_H = [];
var waitMove = false;
var ctList = [];
var TextStep, TextScore;

function init() {
  const { width, height } = this.cameras.main;
  WIDTH = width;
  HEIGHT = height;
  ROWS = Math.floor((HEIGHT - 100) / GEM_WIDTH);
  COLS = Math.floor(WIDTH / GEM_WIDTH);
  console.log({
    WIDTH,
    HEIGHT,
    GEM_WIDTH,
    ROWS,
    COLS
  });
}
function preload() {
  this.load.spritesheet("timg", "statics/img/timg.png", {
    frameWidth: GEM_SIZE,
    frameHeight: GEM_SIZE
  });
}

function create() {
  const arr: any[] = [];
  const offsetX = GEM_WIDTH / 2 + (WIDTH % GEM_WIDTH) / 2;
  for (var i = 0; i < COLS; i++) {
    for (var j = 0; j < ROWS; j++) {
      var gem = this.add
        .image(
          i * GEM_WIDTH + offsetX,
          j * GEM_WIDTH + GEM_WIDTH / 2,
          "timg",
          Math.floor(Math.random() * 6)
        )
        .setScale(SCALE)
        .setName(i + j * COLS)
        .setInteractive();
      gem.on("pointerdown", clickSprite);
      arr.push[gem];
    }
  }
}
const clickArr: any[] = [];
function clickSprite() {
  console.log(this.name);
  const { x, y } = this;
  if (!clickArr[0]) {
    clickArr[0] = this;
    console.log("first");
  } else {
    clickArr[1] = this;
    const pre = clickArr[0];
    const tmp = { x: this.x, y: this.y };
    console.log("second");
    if (pre.name !== this.name) {
      this.x = pre.x;
      this.y = pre.y;
      Object.assign(pre, tmp);
    }
    clickArr.splice(0);
  }
}

function update() {}
