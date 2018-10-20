let canvasWidth = 965;
let canvasHeight = 720;

let obstaclesCount = 20;
let tankWidth = 20;

let gameToPlay = 2;
let speed = 1;
let generation = 1;

let obstacles = [];
let bases = [];
let deadTanks = [];
let gameOver = false;

let gameWindow = function(game) {
  let t = 0;
  let gamePlayed = 0;

  game.preload = function() {};

  game.setup = function() {
    canvas = game.createCanvas(canvasWidth, canvasHeight);
    canvas.class("box-shadow");
    canvas.mousePressed(mousePressedOnCanvas);
    // game.frameRate(90);
    game.strokeWeight(2);
    game.stroke(84, 56, 71);
    game.angleMode(game.DEGREES);

    initialize(game, true);
  };

  game.draw = function() {
    display();
    startGame(game, t);
    checkGameResult();

    t++;
    if (t % 60 === 0) t = 0;
  };

  game.keyPressed = function() {
    if (game.keyCode === 65) {
      bases[0].tanks[0].turretAngle -= 45;
    } else if (game.keyCode === 68) {
      bases[0].tanks[0].turretAngle += 45;
    }
  };

  display = function() {
    game.background(242, 230, 193);
    obstacles.forEach(function(obstacle) {
      obstacle.display();
    });

    let obstaclesToCheck = [];

    bases.forEach(function(base) {
      obstaclesToCheck = obstaclesToCheck.concat(base);
      let indexBase = bases.indexOf(base);
      let opponentBase = indexBase === 0 ? bases[1] : bases[0];

      base.tanks.forEach(function(tank) {
        let friendlyTanks = base.tanks.filter(t => t != tank);
        obstaclesToCheck = obstaclesToCheck.concat(tank);

        tank.bullets.forEach(function(bullet) {
          obstaclesToCheck = obstaclesToCheck.concat(bullet);
          bullet.display();
          bullet.update();

          if (bullet.distTravelled >= bullet.maxRange) {
            tank.bullets.splice(tank.bullets.indexOf(bullet), 1);
            tank.targetsHit = [...tank.targetsHit, null];
          } else {
            for (obstacle of obstacles.concat(
              opponentBase,
              opponentBase.tanks,
              base,
              friendlyTanks
            )) {
              if (bullet.collide(obstacle)) {
                tank.bullets.splice(tank.bullets.indexOf(bullet), 1);
                tank.targetsHit = [...tank.targetsHit, obstacle];
                break;
              }
            }
          }
        });
      });

      base.display(obstacles.concat(obstaclesToCheck));
    });
  };

  checkGameResult = function() {
    if (
      (bases[0].health === 0 && bases[1].health === 0) ||
      (bases[0].tanks.length === 0 && bases[1].tanks.length === 0)
    ) {
      console.log("%cIt's a tie", "color: orange");
      gameOver = true;
      gamePlayed++;
    }
    bases.forEach(function(base) {
      if (base.tanks.length === 0 || base.health <= 0) {
        let winTeam = bases.indexOf(base) == 0 ? "Blue" : "Red";
        console.log("%cWinner Winner Chicken Dinner!!", "color: green");
        if (winTeam === "Red") {
          console.log("%cTeam " + winTeam + " won!!", "color: red");
        } else {
          console.log("%cTeam " + winTeam + " won!!", "color: blue");
        }
        gameOver = true;
        gamePlayed++;
      }
    });

    if (gameOver) {
      bases.forEach(function(base) {
        deadTanks =
          base.tanks.length === 0
            ? [...deadTanks, ...base.deadTanks]
            : [...deadTanks, ...base.deadTanks, ...base.tanks];
      });

      if(gamePlayed === gameToPlay){
        evolve(deadTanks, bases, game);
        deadTanks = [];
        generation++;
        initialize(game, true);
      } else {
        initialize(game, false);
      }
    }
  };
};
let cnv = new p5(gameWindow, "gameWindow");

function initialize(game, resetGame) {
  let colorRed = game.color(249, 67, 54);
  let colorBlue = game.color(66, 80, 244);
  let colorMountain = game.color(183, 154, 97);

  gameOver = false;

  // Obstacles
  if (resetGame) {
    obstacles = [];
    bases = [];
    for (let i = 0; i < obstaclesCount; i++) {
      while (true) {
        let x = __getRandomIntInclusive(10, canvasWidth - 80);
        let y = __getRandomIntInclusive(120, canvasHeight - 220);
        let width = __getRandomIntInclusive(50, 100);
        let height = __getRandomIntInclusive(50, 100);

        let hit = false;

        for (let base of bases) {
          for (let tank of base.tanks) {
            hit = game.collideRectRect(
              x,
              y,
              width,
              height,
              tank.x,
              tank.y,
              tank.width,
              tank.height
            );
            if (hit) break;
          }
          if (hit) break;
        }

        if (!hit) {
          for (let obstacle of obstacles) {
            hit = game.collideRectRect(
              x,
              y,
              width,
              height,
              obstacle.x,
              obstacle.y,
              obstacle.width,
              obstacle.height
            );
            if (hit) break;
          }
        }

        if (!hit) {
          obstacles = [
            ...obstacles,
            new Mountain(game, x, y, width, height, colorMountain)
          ];
          break;
        }
      }
    }
    // Bases
    bases = [
      ...bases,
      new Base(game, obstacles, 0, colorRed, null, null),
      new Base(game, obstacles, 1, colorBlue, null, null)
    ];
  } else {
    let x0 = bases[0].x;
    let y0 = bases[0].y;
    let x1 = bases[1].x;
    let y1 = bases[1].y;
    bases = [];
    bases = [
      ...bases,
      new Base(game, obstacles, 0, colorRed, x0, y0),
      new Base(game, obstacles, 1, colorBlue, x1, y1)
    ];
  }
}

function startGame(game, t) {
  // movement through nn
  for (var i = 0; i < speed; i++) {
    bases.forEach(function(base) {
      let indexBase = bases.indexOf(base); 
      let opponentBase = (indexBase === 0) ? bases[1] : bases[0];
      base.tanks.forEach(function(tank){
        let friendlyTanks = base.tanks.filter(t => t !=  tank);
        tank.train();
        let direction = tank.predictMovementDirection();
        tank.checkForCollisionAndMove(obstacles.concat(opponentBase, opponentBase.tanks, base, friendlyTanks), direction);

        if (t % 60 === 0) {
          tank.moveTurret();
        }
      });
    });
  }

  // movement through keyboard
  if (bases[0].tanks[0] != undefined)
  if (game.keyIsDown(game.LEFT_ARROW)) {
    bases[0].tanks[0].checkForCollisionAndMove(obstacles.concat(bases[1], bases[1].tanks, bases[0], bases[0].tanks.filter(t=>t!=bases[0].tanks[0])), 0);
  } else if (game.keyIsDown(game.RIGHT_ARROW)) {
    bases[0].tanks[0].checkForCollisionAndMove(obstacles.concat(bases[1], bases[1].tanks, bases[0], bases[0].tanks.filter(t=>t!=bases[0].tanks[0])), 1);
  } else if (game.keyIsDown(game.UP_ARROW)) {
    bases[0].tanks[0].checkForCollisionAndMove(obstacles.concat(bases[1], bases[1].tanks, bases[0], bases[0].tanks.filter(t=>t!=bases[0].tanks[0])), 2);
  } else if (game.keyIsDown(game.DOWN_ARROW)) {
    bases[0].tanks[0].checkForCollisionAndMove(obstacles.concat(bases[1], bases[1].tanks, bases[0], bases[0].tanks.filter(t=>t!=bases[0].tanks[0])), 3);
  }
}

function restart() {
  console.clear();
  initialize(cnv, true);
  cnv.loop();
}

function pause() {
  cnv.noLoop();
}

function resume() {
  cnv.loop();
}

function mousePressedOnCanvas() {
  // bases.forEach(function(base) {
  //   base.tanks.forEach(function(tank){
  //     tank.fire();
  //   });
  // });
  bases[0].tanks[0].fire();
}

function toggleFOV() {
  bases.forEach(function(base) {
    base.tanks.forEach(function(tank) {
      tank.showFOV = tank.showFOV ? false : true;
    });
  });
}

function __getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
