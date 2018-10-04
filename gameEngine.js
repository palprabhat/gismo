let canvasWidth = 640;
let canvasHeight = 480;

let obstacles = [];
let bases = [];

let xMountain = 150;
let yMountain = 100;
let mountainWidth = 100;
let mountainHeight = 50;

let tankWidth = 20;

let gameWindow = function(game) {
  let colorRed = game.color(249, 67, 54);
  let colorBlue = game.color(66, 80, 244);
  let colorMountain = game.color(183, 154, 97);

  let t = 0;

  let leftMovement = false;
  let upMovement = false;
  let rightMovement = false;
  let downMovement = false;

  game.preload = function() {};

  game.setup = function() {
    canvas = game.createCanvas(canvasWidth, canvasHeight);
    canvas.class("box-shadow");
    game.strokeWeight(2);
    game.stroke(84, 56, 71);
    game.angleMode(game.DEGREES);

    // Bases
    bases.push(new Base(game, 0, colorRed));
    bases.push(new Base(game, 1, colorBlue));

    // Obstacles
    obstacles.push(new Mountain(game, xMountain, yMountain, mountainWidth, mountainHeight, colorMountain));
    obstacles.push(new Mountain(game, xMountain + 300, yMountain, mountainWidth / 2, mountainHeight * 2, colorMountain));
    obstacles.push(new Mountain(game, xMountain, yMountain + 200, mountainWidth, mountainHeight, colorMountain));
    obstacles.push(new Mountain(game, xMountain + 250, yMountain + 180, mountainWidth, mountainHeight, colorMountain));
  };

  game.draw = function() {
    game.background(242, 230, 193);

    // movement through nn
    t += 1;
    bases.forEach(function(base){
      let indexBase = bases.indexOf(base);
      let opponentBase = (indexBase === 0) ? bases[1] : bases[0];
      base.tanks.forEach(function(tank){
        tank.train();
        let direction = tank.predictMovementDirection();
        tank.checkForCollisionAndMove(obstacles.concat(opponentBase, opponentBase.tanks), direction);

        if (t % 60 === 0) {
          tank.moveTurret();
          t = 0;
        }
      });
    });
  
    // movement through keyboard
    // let opponentBase = bases[1];
    // if (bases[0].tanks[0] != undefined)
    // if (game.keyIsDown(game.LEFT_ARROW)) {
    //     if (!(bases[0].tanks[0].__checkCollision(obstacles.concat(opponentBase, opponentBase.tanks), 0)) || leftMovement){
    //       bases[0].tanks[0].x -=1;
    //       leftMovement = false;
    //       upMovement = false;
    //       downMovement = false;
    //       rightMovement = false;
    //     } else {
    //       leftMovement = false;
    //       upMovement = true;
    //       downMovement = true;
    //       rightMovement = true;
    //     }
    // } else if (game.keyIsDown(game.RIGHT_ARROW)) {
    //     if (!(bases[0].tanks[0].__checkCollision(obstacles.concat(opponentBase, opponentBase.tanks), 1)) || rightMovement){
    //       bases[0].tanks[0].x += 1;
    //       leftMovement = false;
    //       upMovement = false;
    //       downMovement = false;
    //       rightMovement = false;
    //     } else {
    //       leftMovement = true;
    //       upMovement = true;
    //       downMovement = true;
    //       rightMovement = false;
    //     }
    // } else if (game.keyIsDown(game.UP_ARROW)) {
    //     if (!(bases[0].tanks[0].__checkCollision(obstacles.concat(opponentBase, opponentBase.tanks), 2)) || upMovement){
    //       bases[0].tanks[0].y -= 1;
    //       leftMovement = false;
    //       upMovement = false;
    //       downMovement = false;
    //       rightMovement = false;
    //     } else{
    //       leftMovement = true;
    //       upMovement = false;
    //       downMovement = true;
    //       rightMovement = true;
    //     }
    // } else if (game.keyIsDown(game.DOWN_ARROW)) {
    //     if (!(bases[0].tanks[0].__checkCollision(obstacles.concat(opponentBase, opponentBase.tanks), 3)) || downMovement){
    //       bases[0].tanks[0].y += 1;
    //       leftMovement = false;
    //       upMovement = false;
    //       downMovement = false;
    //       rightMovement = false;
    //     } else {
    //       leftMovement = true;
    //       upMovement = true;
    //       downMovement = false;
    //       rightMovement = true;
    //     }
    // }

    display();
  };

  display = function(){
    obstacles.forEach(function(obstacle){
      obstacle.display();
    });
    bases.forEach(function(base){
      base.display();
    });
  }

  // collide = function(tank, obstacles, direction){
  //   let collide = false;
  //   let BreakException = {};

  //   try{
  //     obstacles.forEach(function(obstacle){
  //       collide = tank.checkCollision(obstacle, direction);
  //       if(collide){
  //         throw BreakException;
  //       }
  //     });
  //   } catch (e){
  //     if (e !== BreakException) throw e;
  //   }
  //   return collide;
  // }

  game.mousePressed = function() {
    bases[0].tanks[0].fire();
  };

  game.keyPressed = function(){
    if (game.keyCode === 65){
      bases[0].tanks[0].viewAngle -= 45;
    } else
    if (game.keyCode === 68){
      bases[0].tanks[0].viewAngle += 45;
    }
  };
  
};
let cnv = new p5(gameWindow, "gameWindow");
