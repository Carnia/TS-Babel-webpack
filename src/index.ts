import { AUTO, Game, Math } from "phaser";
let config = {
  type: AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Game(config);
console.log(game);

let cursors: any;
let player: any;
let stars: any;
let bombs: any;
let score = 0;
let scoreText: any;

function preload() {
  this.load.image("sky", "statics/imgs/sky.png");
  this.load.image("ground", "statics/imgs/platform.png");
  this.load.image("star", "statics/imgs/star.png");
  this.load.image("bomb", "statics/imgs/bomb.png");
  this.load.spritesheet("dude", "statics/imgs/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
}

function create() {
  this.add.image(0, 0, "sky").setOrigin(0, 0);

  const platforms = this.physics.add.staticGroup();

  platforms
    .create(400, 568, "ground")
    .setScale(2)
    .refreshBody(); // 更新物理系统中的碰撞模型尺寸
  platforms.create(600, 400, "ground");
  platforms.create(50, 250, "ground");
  platforms.create(750, 220, "ground");

  player = this.physics.add.sprite(500, 150, "dude");

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, platforms);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  cursors = this.input.keyboard.createCursorKeys();

  stars = this.physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function(child: any) {
    child.setBounceY(Math.FloatBetween(0.4, 0.8));
  });
  this.physics.add.collider(stars, platforms);

  this.physics.add.overlap(player, stars, collectStar, null, this);
  function collectStar(player: any, star: any) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText("Score: " + score);
    if (stars.countActive(true) === 0) {
      stars.children.iterate(function(child: any) {
        child.enableBody(true, child.x, 0, true, true);
      });

      let x = player.x < 400 ? Math.Between(400, 800) : Math.Between(0, 400);

      let bomb = bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Math.Between(-200, 200), 20);
    }
  }

  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000"
  });

  bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);

  this.physics.add.collider(player, bombs, hitBomb, null, this);
  function hitBomb(player: any, bomb: any) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    // gameOver = true;
  }
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }
  if (cursors.space.isDown && player.body.touching.down) {
    player.setVelocityY(-430);
  }
}
