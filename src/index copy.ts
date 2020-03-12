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
var ROWS, COLS;
var GEM_SIZE = 70,
  MIN_CLEAR = 3;
var gems;
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
  ROWS = Math.floor((HEIGHT - 100) / GEM_SIZE);
  COLS = Math.floor(WIDTH / GEM_SIZE);
}
function preload() {
  this.load.spritesheet("timg", "statics/img/timg.png", {
    frameWidth: GEM_SIZE,
    frameHeight: GEM_SIZE
  });
}

function create() {
  // this.add.image(100, 100, "timg", 0);
  // this.add.image(200, 100, "timg", 1);

  // var group = this.add.group({
  //   key: "timg",
  //   frame: Phaser.Utils.Array.NumberArray(0, 5),
  //   randomFrame: true,
  //   // frameQuantity: 2,
  //   max: 81,
  //   setXY: {
  //     x: GEM_SIZE / 2,
  //     y: GEM_SIZE / 2,
  //     stepX: GEM_SIZE
  //     // stepY: GEM_SIZE
  //   },
  //   setScale: {
  //     x: 0.8,
  //     y: 0.8
  //   }
  //   // gridAlign: {
  //   //   x: GEM_SIZE / 2,
  //   //   y: GEM_SIZE / 2,
  //   //   width: WIDTH,
  //   //   height: HEIGHT,
  //   //   cellWidth: GEM_SIZE,
  //   //   cellHeight: GEM_SIZE
  //   // }
  // });
  console.log(group);

  // const group = this.add.group({
  //   defaultKey: "timg",
  //   maxSize: 100,
  //   createCallback: function(timg: any) {
  //     timg.setName("timg" + this.getLength());
  //     console.log("Created", timg.name);
  //   },
  //   removeCallback: function(timg: any) {
  //     console.log("Removed", timg.name);
  //   }
  // });
  // group.get(100, 100, "timg", 2);
}

function update() {}
