import Phaser from "phaser";
interface MenuScene extends Sence {
  makeLogo?: () => void;
  loadSources?: () => void;
}
const MenuScene: MenuScene = new Phaser.Scene("menu");
MenuScene.init = function() {
  console.log("init 【menu】");
};
MenuScene.update = function() {
  this.bg.tilePositionX += 0.5;
  this.ground.tilePositionX += 1;
};
MenuScene.create = function() {
  const { width, height } = this.cameras.main;
  const platforms = MenuScene.physics.add.staticGroup();
  const bg = this.add
    .tileSprite(0, 0, width, height, "background")
    .setOrigin(0); //当作背景的tileSprite
  //当作地面的tileSprite
  const ground = MenuScene.add
    .tileSprite(0, height - 112, width, 112, "ground")
    .setOrigin(0);
  platforms.add(ground);
  Object.assign(this, { bg, ground });

  const bird = this.physics.add.sprite(100, 0, "bird");
  bird.setBounce(0.4);
  bird.setCollideWorldBounds(true);
  this.physics.add.collider(ground, bird);
};
export default MenuScene;
