import Phaser from "phaser";
interface PlayScene extends Sence {
  createSound?: () => void;
  loadAnims?: () => void;
  createPlatforms?: () => void;
  createBird?: () => void;
  createText?: () => void;
  createPipes?: () => void;
  createPointEvent?: () => void;
  startGame?: () => void;
  pointDown?: (point: any) => void;
}
const PlayScene: PlayScene = new Phaser.Scene("play");
PlayScene.init = function() {
  console.log("init 【play】");
  this.gameSpeed = 2; //游戏速度
  this.gameIsOver = false; //游戏是否已结束的标志
  this.hasHitGround = false; //是否已碰撞到地面的标志
  this.hasStarted = false; //游戏是否已经开始的标志
  this.score = 0; //初始得分
};

PlayScene.createSound = function() {
  this.soundFly = this.sound.add("fly_sound");
  this.soundScore = this.sound.add("score_sound");
  this.soundHitPipe = this.sound.add("hit_pipe_sound");
  this.soundHitGround = this.sound.add("hit_ground_sound");
};

PlayScene.loadAnims = function() {
  const config = {
    key: "fly",
    frames: this.anims.generateFrameNumbers("bird", {
      start: 0,
      end: 2,
      first: 0
    }),
    frameRate: 20,
    repeat: 1
  };

  this.anims.create(config);
};

PlayScene.update = function() {
  this.bg.tilePositionX += this.gameSpeed / 5;
  this.ground.tilePositionX += this.gameSpeed;
  if (this.bird.angle < 90) this.bird.angle += this.bird.headDownAngle || 0; //下降时头朝下
};

PlayScene.createPlatforms = function() {
  const { width, height } = this.cameras.main;
  // 静态背景
  const platforms = this.physics.add.staticGroup();
  //背景、使用tileSprite创建
  const bg = this.add
    .tileSprite(0, 0, width, height, "background")
    .setOrigin(0);
  //地面、使用tileSprite创建
  const ground = this.add
    .tileSprite(0, height - 112, width, 112, "ground")
    .setOrigin(0);
  platforms.add(ground);

  // 用于update
  Object.assign(this, { bg, ground });
};

PlayScene.createBird = function() {
  // 创建bird和执行动画
  const bird = this.physics.add.sprite(50, 150, "bird");
  bird.setAngle(0);
  bird.setGravity(0, 0);
  bird.setCollideWorldBounds(true);
  // 鸟和地面碰撞
  this.physics.add.collider(this.ground, bird, function(
    ground: any,
    bird: any
  ) {
    bird.headDownAngle = 0;
  });

  this.bird = bird;
};

PlayScene.createText = function() {
  const { width, height } = this.cameras.main;
  this.readyText = this.add.image(width / 2, height * 0.2, "ready_text"); //get ready 文字
  this.playTip = this.add.image(width / 2, height * 0.7, "play_tip"); //提示点击屏幕的图片
};

PlayScene.createPipes = function() {
  this.pipeGroup = this.add.group();
  const timedEvent = this.time.addEvent({
    delay: 5000,
    callback: () => {
      console.log("createPipes");
    },
    callbackScope: this,
    loop: true
  });
};

PlayScene.createPointEvent = function() {
  let cb: any = () => {
    this.startGame();
    cb = this.pointDown.bind(this);
  };
  this.input.on(
    "pointerdown",
    function(...args: any) {
      cb(...args);
    },
    this
  );
};
PlayScene.pointDown = function(pointer: any) {
  console.log(this.bird);
  this.bird.setVelocityY(-300);
  this.bird.anims.play("fly");
  PlayScene.tweens.add({
    targets: this.bird, //精灵或者精灵数组
    angle: -30,
    ease: "Linear",
    duration: 100,
    yoyo: false, //是否返回（像溜溜球一样）
    repeat: 0, // -1 for infinite repeats
    callbackScope: this
  });
  this.soundFly.play();
};

PlayScene.startGame = function() {
  this.bird.setGravity(0, 1150); //给鸟设一个重力
  this.bird.headDownAngle = 1.5; //给鸟头部朝下的重力
  this.readyText.destroy(); //去除 'get ready' 图片
  this.playTip.destroy(); //去除 '玩法提示 图片
};
PlayScene.secret = function() {
  const { width, height } = this.cameras.main;
  this.haha = this.make.text({
    x: width / 2,
    y: height / 2,
    text: "🍅",
    scale: 0.5,
    style: {
      font: "18px monospace",
      fill: "#ffffff"
    },
    visible: false
  });
  this.haha.setOrigin(0.5, 0.5);
};
PlayScene.secretUpdate = function(pointer: any) {
  this.haha.setVisible(true);
  this.haha.x = pointer.x;
  this.haha.y = pointer.y;
};

PlayScene.create = function() {
  this.createSound();
  this.loadAnims();
  this.createPlatforms();
  this.createPipes();
  this.createText();
  this.createBird();
  this.createPointEvent();
};
export default PlayScene;
