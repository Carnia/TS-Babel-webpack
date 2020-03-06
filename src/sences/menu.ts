import Phaser from "phaser";
interface MenuScene extends Sence {
  loadAnims?: () => void;
  createPlatforms?: () => void;
  createTitle?: () => void;
  createBtn?: () => void;
}
const MenuScene: MenuScene = new Phaser.Scene("menu");
MenuScene.init = function() {
  console.log("init 【menu】");
};
MenuScene.update = function() {
  this.bg.tilePositionX += 0.5;
  this.ground.tilePositionX += 2;
};
MenuScene.loadAnims = function() {
  const config = {
    key: "fly",
    frames: MenuScene.anims.generateFrameNumbers("bird", {
      start: 0,
      end: 2,
      first: 0
    }),
    frameRate: 10,
    repeat: -1
  };

  this.anims.create(config);
};
MenuScene.createPlatforms = function() {
  const { width, height } = this.cameras.main;
  // 静态背景
  const platforms = MenuScene.physics.add.staticGroup();
  //背景、使用tileSprite创建
  const bg = this.add
    .tileSprite(0, 0, width, height, "background")
    .setOrigin(0);
  //地面、使用tileSprite创建
  const ground = MenuScene.add
    .tileSprite(0, height - 112, width, 112, "ground")
    .setOrigin(0);
  platforms.add(ground);
  // 创建bird和执行动画
  const bird = MenuScene.physics.add.sprite(100, 0, "bird");
  bird.setBounce(0.4);
  bird.setCollideWorldBounds(true);
  bird.anims.play("fly");
  // 鸟和地面碰撞
  this.physics.add.collider(ground, bird);
  // 用于update
  Object.assign(this, { bg, ground });
};
MenuScene.createTitle = function() {
  const { width, height } = this.cameras.main;
  const titleContainer = MenuScene.add.container(width / 2, height / 4); //创建存放标题的组
  const title = this.add.sprite(-20, 0, "title"); //标题
  const bird2 = this.add.sprite(100, 0, "bird"); //添加bird到组里
  bird2.anims.play("fly");
  titleContainer.add([bird2, title]);
  this.tweens.add({
    targets: titleContainer,
    y: height / 5,
    duration: 1500,
    yoyo: true,
    repeat: -1
  });
};

MenuScene.createBtn = function() {
  const { width, height } = this.cameras.main;
  const btn = MenuScene.add.sprite(width / 2, height / 2, "btn");
  btn.setInteractive();
  btn.on("pointerdown", () => {
    console.log("pointerdown");
  });
};

MenuScene.create = function() {
  this.loadAnims();
  this.createPlatforms();
  this.createTitle();
  this.createBtn();
};
export default MenuScene;
