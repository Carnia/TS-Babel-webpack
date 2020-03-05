import Phaser from "phaser";
import "./assets/scss/reset.scss";
import preload from "./sences/preload";
import menu from "./sences/menu";
const docElement = document.documentElement;
const width = docElement.clientWidth;
const height = docElement.clientHeight;
var config = {
  type: Phaser.AUTO,
  width,
  height,
  parent: "app",
  backgroundColor: "#fff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  }
};

var game = new Phaser.Game(config);
game.scene.add("preload", preload);
game.scene.add("menu", menu);
game.scene.start("preload");
