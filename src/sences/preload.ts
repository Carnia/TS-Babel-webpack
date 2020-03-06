import Phaser from "phaser";
interface PreloadScene extends Sence {
  makeLogo?: () => void;
  loadSources?: () => void;
}
const PreloadScene: PreloadScene = new Phaser.Scene("preload");
PreloadScene.init = function() {
  console.log("init 【preload】");
};
PreloadScene.preload = function() {
  console.log("preload");

  // const staticWrapper = PreloadScene.physics.add.staticGroup();

  const { width, height } = this.cameras.main;
  const progressBox = this.add.graphics();
  const progressBar = this.add.graphics();

  progressBox.fillStyle(0x222222, 0.8);
  progressBox.fillRect(width / 2 - 120, height / 2 - 15, 240, 30);
  const loadingText = this.make.text({
    x: width / 2 + 10,
    y: height / 2 - 40,
    text: "Loading...",
    style: {
      font: "20px monospace",
      fill: "#000"
    }
  });
  loadingText.setOrigin(0.5, 0.5);
  const percentText = this.make.text({
    x: width / 2,
    y: height / 2,
    text: "0%",
    style: {
      font: "18px monospace",
      fill: "#ffffff"
    }
  });
  percentText.setOrigin(0.5, 0.5);

  this.load.on("progress", function(value: number) {
    percentText.setText(Math.floor(value * 100) + "%");
    progressBar.clear();
    progressBar.fillStyle(0xcccccc, 1);
    progressBar.fillRect(width / 2 - 115, height / 2 - 10, 230 * value, 20);
  });

  // this.load.on("fileprogress", function(file: any) {});
  this.load.on("complete", () => {
    progressBar.destroy();
    progressBox.destroy();
    percentText.destroy();
    loadingText.destroy();
  });
  this.loadSources();
  // this.sound.play("flap.wav");
};

PreloadScene.makeLogo = function() {
  const { width, height } = this.cameras.main;
  const logo = this.make.text({
    x: width / 2,
    y: height / 2,
    text: "🍅",
    scale: 0.5,
    style: {
      font: "18px monospace",
      fill: "#ffffff"
    },
    visible: true
  });
  logo.setOrigin(0.5, 0.5);

  this.logoTween = new Promise((resolve, rejecrt) => {
    PreloadScene.tweens.add({
      targets: logo,
      rotation: 2 * Math.PI,
      scale: 1.5,
      ease: "Linear",
      duration: 3000,
      // yoyo: true,
      repeat: 0, // -1 for infinite repeats
      onStart: function() {},
      onComplete: function() {
        resolve();
      },
      onYoyo: function() {
        console.log("onYoyo");
      },
      onRepeat: function() {
        console.log("onRepeat");
      },
      callbackScope: PreloadScene
    });
  });
  return this.logoTween;
};
PreloadScene.loadSources = function() {
  //以下为要加载的资源
  this.load.image("background", "statics/assets/background.png"); //游戏背景图
  this.load.image("ground", "statics/assets/ground.png"); //地面
  this.load.image("title", "statics/assets/title.png"); //游戏标题
  PreloadScene.load.spritesheet("bird", "statics/assets/bird.png", {
    frameWidth: 34,
    frameHeight: 24,
    startFrame: 1,
    endFrame: 3
  }); //鸟 3
  this.load.image("btn", "statics/assets/start-button.png"); //按钮
  this.load.spritesheet("pipe", "statics/assets/pipes.png", {
    frameWidth: 54,
    frameHeight: 320
  }); //管道2
  this.load.bitmapFont(
    "flappy_font",
    "statics/assets/fonts/flappyfont/flappyfont.png",
    "statics/assets/fonts/flappyfont/flappyfont.fnt"
  ); //显示分数的字体
  this.load.audio("fly_sound", "statics/assets/flap.wav"); //飞翔的音效
  this.load.audio("score_sound", "statics/assets/score.wav"); //得分的音效
  this.load.audio("hit_pipe_sound", "statics/assets/pipe-hit.wav"); //撞击管道的音效
  this.load.audio("hit_ground_sound", "statics/assets/ouch.wav"); //撞击地面的音效

  this.load.image("ready_text", "statics/assets/get-ready.png"); //get ready图片
  this.load.image("play_tip", "statics/assets/instructions.png"); //玩法提示图片
  this.load.image("game_over", "statics/assets/gameover.png"); //gameover图片
  this.load.image("score_board", "statics/assets/scoreboard.png"); //得分板
};
PreloadScene.create = function() {
  this.scene.start("play", { aaa: 234 });
  this.makeLogo().then(() => {
    setTimeout(() => {
      this.scene.start("menu", { aaa: 234 });
    }, 1000);
  });
};
export default PreloadScene;
