let canvasWidth = 640;
let canvasHeight = 480;

let xBaseA = 10;
let yBaseA = 10;
let baseAWidth = 50;

let xBaseB = 580;
let yBaseB = 420;
let baseBWidth = 50;

let xMountain = 150;
let yMountain = 100;
let mountainWidth = 100;
let mountainHeight = 50;

let tankWidth = 20;

let gameWindow = function(game) {
  let b1, b2, m1, m2, m3, m4, t11, t21;
  let t = 0;
  let left = false;
  let up = false;
  let right = false;
  let down = false;
  game.preload = function() {};

  game.setup = function() {
    canvas = game.createCanvas(canvasWidth, canvasHeight);
    canvas.class("box-shadow");
    // game.frameRate(15);
    game.strokeWeight(2);
    game.stroke(84, 56, 71);
    game.angleMode(game.DEGREES);

    // BlockHouses
    b1 = new Base(game, xBaseA, yBaseA, baseAWidth, baseAWidth);
    b2 = new Base(game, xBaseB, yBaseB, baseBWidth, baseBWidth);

    // Obstacles
    m1 = new Mountain(
      game,
      xMountain,
      yMountain,
      mountainWidth,
      mountainHeight
    );
    m2 = new Mountain(
      game,
      xMountain + 300,
      yMountain,
      mountainWidth / 2,
      mountainHeight * 2
    );
    m3 = new Mountain(
      game,
      xMountain,
      yMountain + 200,
      mountainWidth,
      mountainHeight
    );
    m4 = new Mountain(
      game,
      xMountain + 250,
      yMountain + 180,
      mountainWidth,
      mountainHeight
    );

    // Tanks
    t11 = new Tank(game, xBaseA + 55, yBaseA, tankWidth);
    t21 = new Tank(game, xBaseB - 25, yBaseB + tankWidth, tankWidth);
  };

  game.draw = function() {
    t += 1;
    game.background(242, 230, 193);
    game.fill(249, 67, 54);
    b1.display();
    game.fill(66, 80, 244);
    b2.display();

    game.fill(183, 154, 97);
    m1.display();
    m2.display();
    m3.display();
    m4.display();

    game.fill(0);

    //movement through nn
    // t11.train();
    // t21.train();
    // t11.move();
    // t21.move();
    // //turret movement
    // if (t % 60 == 0) {
    //   t11.moveTurret();
    //   t21.moveTurret();
    //   t = 0;
    // }

    //movement through keyboard
    if (game.keyIsDown(game.LEFT_ARROW)) {
      if (t11.x > 1) {
        if (
          // !(t11.__checkCollisionX(m1) ||
          // t11.__checkCollisionX(m2) ||
          // t11.__checkCollisionX(m3) ||
          // t11.__checkCollisionX(m4)
          !(
            t11.checkCollision(m1, 2) ||
            t11.checkCollision(m2, 2) ||
            t11.checkCollision(m3, 2) ||
            t11.checkCollision(m4, 2)
          ) ||
          left
        ) {
          t11.x -= 1;
          left = false;
          up = false;
          down = false;
          right = false;
        } else {
          left = false;
          up = true;
          down = true;
          right = true;
        }
      }
    } else if (game.keyIsDown(game.RIGHT_ARROW)) {
      if (t11.x + t11.width < game.width) {
        if (
          !(
            t11.checkCollision(m1, 3) ||
            t11.checkCollision(m2, 3) ||
            t11.checkCollision(m3, 3) ||
            t11.checkCollision(m4, 3)
          ) ||
          right
        ) {
          t11.x += 1;
          left = false;
          up = false;
          down = false;
          right = false;
        } else {
          left = true;
          up = true;
          down = true;
          right = false;
        }
      }
    } else if (game.keyIsDown(game.UP_ARROW)) {
      if (t11.y > 1) {
        if (
          !(
            t11.checkCollision(m1, 0) ||
            t11.checkCollision(m2, 0) ||
            t11.checkCollision(m3, 0) ||
            t11.checkCollision(m4, 0)
          ) ||
          up
        ) {
          t11.y -= 1;
          left = false;
          up = false;
          down = false;
          right = false;
        } else {
          left = true;
          up = false;
          down = true;
          right = true;
        }
      }
    } else if (game.keyIsDown(game.DOWN_ARROW)) {
      if (t11.y + t11.width < game.height) {
        if (
          !(
            t11.checkCollision(m1, 1) ||
            t11.checkCollision(m2, 1) ||
            t11.checkCollision(m3, 1) ||
            t11.checkCollision(m4, 1)
          ) ||
          down
        ) {
          t11.y += 1;
          left = false;
          up = false;
          down = false;
          right = false;
        } else {
          left = true;
          up = true;
          down = false;
          right = true;
        }
      }
    }

    t11.display("1");
    t21.display("2");

    // t21.display(game.random(360));
    // t21.x -= 1;
    // if(t21.x <= 0){t21.x = xBaseB-25;}
  };

  game.mousePressed = function() {
    t11.fire();
  };

  // game.keyPressed = function(){
  // if (game.keyCode == 65){
  //     angle -= 45;
  // } else
  // if (game.keyCode == 68){
  //     angle += 45;
  // }
  // }
};
let cnv = new p5(gameWindow, "gameWindow");
