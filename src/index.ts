import Phaser from "phaser";
import "./assets/scss/reset.scss";
import preload from "./sences/preload";
import menu from "./sences/menu";
import play from "./sences/play";
const docElement = document.documentElement;
const width = docElement.clientWidth;
const height = docElement.clientHeight;
var config = {
  type: Phaser.AUTO,
  width,
  height,
  // height: height < 700 ? height : 700,
  parent: "app",
  backgroundColor: "#fff",
  physics: {
    default: "arcade",
    arcade: {
      // gravity: { y: 500 },
      debug: true
    }
  }
};

var game = new Phaser.Game(config);
game.scene.add("preload", preload);
game.scene.add("menu", menu);
game.scene.add("play", play);
game.scene.start("preload");
