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
PlayScene.init = function () {
  console.log("init 【play】");
  this.gameSpeed = 1.5; //游戏速度 移动帧数
  this.createPipeSpeed = 1500; //生成管道速度 ms
  this.gameIsOver = false; //游戏是否已结束的标志
  this.hasHitGround = false; //是否已碰撞到地面的标志
  this.hasStarted = false; //游戏是否已经开始的标志
  this.score = 0; //初始得分
};

PlayScene.createSound = function () {
  this.soundFly = this.sound.add("fly_sound");
  this.soundScore = this.sound.add("score_sound");
  this.soundHitPipe = this.sound.add("hit_pipe_sound");
  this.soundHitGround = this.sound.add("hit_ground_sound");
};

PlayScene.loadAnims = function () {
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

PlayScene.update = function () {
  // 背景移动
  this.bg.tilePositionX += this.gameSpeed / 5;
  this.ground.tilePositionX += this.gameSpeed;
  //下降时头朝下
  if (this.bird.angle < 90) this.bird.angle += this.bird.headDownAngle || 0; 
  // 上下管道移动
  Phaser.Actions.IncX(this.pipeGroup.getChildren(), -this.gameSpeed);
  Phaser.Actions.IncX(this.pipeGroupDown.getChildren(), -this.gameSpeed);
  // 管道消失和计分逻辑
  const birdTailX = this.bird.x - this.bird.width / 2 //鸟尾部X坐标
  const pipeWidth = 54
  this.pipeGroup.children.iterate((pipe:any) => {
    if (pipe.x + pipeWidth < 0) {
      this.pipeGroup.killAndHide(pipe);
    }
    if (pipe.score > 0 && pipe.x + pipeWidth < birdTailX) {
      this.score += pipe.score
      pipe.score = 0
      this.scoreText.text = this.score;//同步计分版
      this.soundScore.play() //计分声音
    }
  });
  this.pipeGroupDown.children.iterate((pipe:any) => {
    if (pipe.x + pipeWidth < 0) {
      this.pipeGroupDown.killAndHide(pipe);
    }
  });
  this.caption.setText(
    Phaser.Utils.String.Format(
      "Total:    %1\n" +
      "Max:      %2\n" +
      "Active:   %3\n" +
      "Inactive: %4\n" +
      "Used:     %5\n" +
      "Free:     %6\n" +
      "Full:     %7\n",
      [
        this.pipeGroup.getLength(),
        this.pipeGroup.maxSize,
        this.pipeGroup.countActive(true),
        this.pipeGroup.countActive(false),
        this.pipeGroup.getTotalUsed(),
        this.pipeGroup.getTotalFree(),
        this.pipeGroup.isFull()
      ]
    )
  );

  this.caption.setDepth(1)
};

PlayScene.createPlatforms = function () {
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
    .setOrigin(0)
    .setDepth(1);
    ground.name = 'ground'
  platforms.add(ground);
  // 用于update
  Object.assign(this, { bg, ground });
};

PlayScene.createBird = function () {
  // 创建bird和执行动画
  const bird = this.physics.add.sprite(50, 150, "bird");
  bird.setAngle(0);
  bird.setGravity(0, 0);
  bird.setCollideWorldBounds(true);
  this.bird = bird;
};

PlayScene.createText = function () {
  const { width, height } = this.cameras.main;
  this.readyText = this.add.image(width / 2, height * 0.2, "ready_text"); //get ready 文字
  this.playTip = this.add.image(width / 2, height * 0.7, "play_tip"); //提示点击屏幕的图片
  this.scoreText = this.add.bitmapText(width / 2, 50, 'flappy_font', '0', 36, 'center');
};

PlayScene.createPipes = function () {
  const { width, height } = this.cameras.main;
  this.pipeGroup = this.physics.add.group({
    defaultKey: "pipe",
    maxSize: Math.ceil(width / 54)
  });
  this.pipeGroupDown = this.physics.add.group({
    defaultKey: "pipe",
    maxSize: Math.ceil(width / 54)
  });
  const createPipesEvent = this.time.addEvent({
    delay: this.createPipeSpeed,
    callback: () => {
      const groundHeight = 112
      const pipeHeight = 320
      const gap = 100; //上下管道之间的间隙宽度
      const minTop = height - groundHeight - pipeHeight - gap
      const center = Phaser.Math.Between(minTop, pipeHeight)// 获取上方管道的底部y值
      var topPipeY = -pipeHeight + center; //上方管道的位置
      var bottomPipeY = center + gap; //下方管道的位置
      const pipeUp = this.pipeGroup.get(width, topPipeY, "pipe", 0, true);
      const pipeDown = this.pipeGroupDown.get(width, bottomPipeY, "pipe", 1, true);
      // if (!pipeUp||!pipeDown) {
      //   return;
      // } // None free
      pipeUp
        .setOrigin(0, 0)
        .setDepth(0)
        .setActive(true)
        .setVisible(true)
        pipeUp.score = 1
        pipeUp.name = 'pipe'
      pipeDown
        .setOrigin(0, 0)
        // .setOrigin(0, pipeDown.height/2)
        .setDepth(0)
        .setActive(true)
        .setVisible(true)
        .setTint(Phaser.Display.Color.RandomRGB().color)
        pipeDown.name = 'pipe'
    },
    callbackScope: this,
    loop: true
  });
  this.createPipesEvent = createPipesEvent
};
PlayScene.createCaption = function () {
  this.caption = this.add.text(16, 400, "", {
    fill: "#000",
    fontFamily: "monospace",
    lineSpacing: 4
  });
};
PlayScene.createPointEvent = function () {
  let cb: any = () => {
    this.startGame();
    cb = this.pointDown.bind(this);
  };
  this.input.on(
    "pointerdown",
    function (...args: any) {
      cb(...args);
    },
    this
  );
};
PlayScene.pointDown = function (pointer: any) {
  this.bird.setVelocityY(-250);
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

PlayScene.startGame = function () {
  this.bird.setGravity(0, 1100); //给鸟设一个重力
  this.bird.headDownAngle = 1.5; //给鸟头部朝下的重力
  this.readyText.destroy(); //去除 'get ready' 图片
  this.playTip.destroy(); //去除 '玩法提示 图片
};
PlayScene.stopGame = function (
  bird: any,
  hitSprite: any
) {
  bird.headDownAngle = 0;
  bird.setGravity(0, 0);
  PlayScene.physics.pause();
  this.createPipesEvent.paused = true;
  this.gameSpeed = 0
  console.log(hitSprite.name);
  switch (hitSprite.name) {
    case 'pipe':
      this.soundHitPipe.play()
      break;
    case 'ground':
      this.soundHitGround.play()
      break;
    default:
      break;
  }
}
PlayScene.secret = function () {
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
PlayScene.secretUpdate = function (pointer: any) {
  this.haha.setVisible(true);
  this.haha.x = pointer.x;
  this.haha.y = pointer.y;
};

PlayScene.create = function () {

  const { width, height } = this.cameras.main;
  this.createSound();
  this.loadAnims();

  this.createPlatforms();
  this.createPipes();
  this.createText();
  this.createBird();
  this.createPointEvent();
  this.createCaption();
  // const graphics = this.add.graphics().fillStyle(0x00ff00).fillRect(0, 0, width, 20);
  // this.physics.world.on('worldbounds', function () {
  //   console.log(1);
    
  // });
  this.physics.add.overlap(this.bird, [this.pipeGroup, this.pipeGroupDown], this.stopGame, null, this);
  this.physics.add.overlap(this.bird, graphics, this.stopGame, null, this);
  this.physics.add.collider(this.bird, this.ground, this.stopGame.bind(this));
};
export default PlayScene;
