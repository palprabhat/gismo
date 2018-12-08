let canvasWidth = 965;
let canvasHeight = 720;

let obstaclesCount = 6;
let tankWidth = 20;

let population = 100;
let gameToPlay = 25;
let speed = 1;
let generation = 1;
let currentIndex  = 0;
let lifeSpan = 500;

let obstacles = [];
let bases = [];
let deadTanks = [];
let gameOver = false;
let frameCount = 0;
let showFOV = false;
let gamePlayed = 0;

let numTanks = population/gameToPlay;

let nnMovementPoolRed = [];
let nnMovementPoolBlue = [];
let nnTurretPoolRed = [];
let nnTurretPoolBlue = [];
let dnaPool = [];

let gameWindow = function(game) {
  game.preload = function() {};

  game.setup = function() {
    canvas = game.createCanvas(canvasWidth, canvasHeight);
    canvas.class("box-shadow");
    
    game.strokeWeight(2);
    game.stroke(84, 56, 71);
    game.angleMode(game.DEGREES);

    for (let i = 0; i < population/2; i++) {
      dnaPool = [...dnaPool, new DNA(game)];
    }

    initialize(game, true);
  };

  game.draw = function() {
    for (var i = 0; i < speed; i++) {
      display();
      playGame(game);
    }

    if (game.keyIsDown(65)) {
      bases[0].tanks[0].turretAngle -= 1;
    }
  
    if (game.keyIsDown(68)) {
      bases[0].tanks[0].turretAngle += 1;
    }

    document.getElementById("generation").innerHTML = generation;
    document.getElementById("populationLeft").innerHTML = (population - deadTanks.length/2).toString() + "/" + population.toString();
    document.getElementById("gameCycle").innerHTML = (gamePlayed+1).toString() + "/" + gameToPlay.toString();
  };

  display = function() {
    game.background(242, 230, 193);
    obstacles.forEach(function(obstacle) {
      obstacle.display();
    });

    bases.forEach(function(base) {
      let obstaclesToCheck = [];
      obstaclesToCheck = obstaclesToCheck.concat(base);
      let indexBase = bases.indexOf(base);
      let opponentBase = indexBase === 0 ? bases[1] : bases[0];

      obstaclesToCheck = obstaclesToCheck.concat(opponentBase, opponentBase.tanks);

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
            for (obstacle of obstacles.concat(opponentBase, opponentBase.tanks, base, friendlyTanks)) {
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
    if ((bases[0].health === 0 && bases[1].health === 0) ||
        (bases[0].tanks.length === 0 && bases[1].tanks.length === 0)) {
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

    if (frameCount >= lifeSpan){
      gameOver = true;
      gamePlayed++;
      frameCount = 0;
    }

    if (gameOver) {
      currentIndex = 0;
      bases.forEach(function(base) {
        deadTanks =
          base.tanks.length === 0
            ? [...deadTanks, ...base.deadTanks]
            : [...deadTanks, ...base.deadTanks, ...base.tanks];
      });

      if(gamePlayed === gameToPlay){
        gamePlayed = 0;
        evolve(deadTanks, bases, game);
        deadTanks = [];
        generation++;
        console.log("generation " + generation);
        initialize(game, false);
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
            hit = game.collideRectRect(x, y, width, height, tank.x, tank.y, tank.width, tank.height);
            if (hit) break;
          }
          if (hit) break;
        }

        if (!hit) {
          for (let obstacle of obstacles) {
            hit = game.collideRectRect(x, y, width, height, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
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
      new Base(game, obstacles, 0, colorRed, null, null, numTanks, 
              nnMovementPoolRed.slice(currentIndex, currentIndex + numTanks), 
              nnTurretPoolRed.slice(currentIndex, currentIndex + numTanks),
              dnaPool.slice(currentIndex, currentIndex + numTanks)),
      new Base(game, obstacles, 1, colorBlue, null, null, numTanks,
              nnMovementPoolBlue.slice(currentIndex, currentIndex + numTanks), 
              nnTurretPoolBlue.slice(currentIndex, currentIndex + numTanks),
              dnaPool.slice(currentIndex, currentIndex + numTanks))
    ];
    currentIndex += numTanks;
  } else {
    let x0 = bases[0].x;
    let y0 = bases[0].y;
    let x1 = bases[1].x;
    let y1 = bases[1].y;
    bases = [];
    bases = [
      ...bases,
      new Base(game, obstacles, 0, colorRed, x0, y0, numTanks,
              nnMovementPoolRed.slice(currentIndex, currentIndex + numTanks), 
              nnTurretPoolRed.slice(currentIndex, currentIndex + numTanks),
              dnaPool.slice(currentIndex, currentIndex + numTanks)),
      new Base(game, obstacles, 1, colorBlue, x1, y1, numTanks,
              nnMovementPoolBlue.slice(currentIndex, currentIndex + numTanks), 
              nnTurretPoolBlue.slice(currentIndex, currentIndex + numTanks),
              dnaPool.slice(currentIndex, currentIndex + numTanks))
    ];
    currentIndex += numTanks;
  }
}

function playGame(game) {
  // movement through nn
  frameCount++;
  bases.forEach(function(base) {
    let indexBase = bases.indexOf(base); 
    let opponentBase = (indexBase === 0) ? bases[1] : bases[0];
    base.tanks.forEach(function(tank){
      let friendlyTanks = base.tanks.filter(t => t !=  tank);
      tank.checkForCollisionAndMove(obstacles.concat(opponentBase, opponentBase.tanks, base, friendlyTanks)); //base, friendlyTanks

    });
  });

  checkGameResult();
}

function restart() {
  console.clear();
  gamePlayed = 0;
  deadTanks = [];
  initialize(cnv, true);
  cnv.loop();
}

function pause() {
  cnv.noLoop();
}

function resume() {
  cnv.loop();
}

function toggleFOV() {
  showFOV = !showFOV;
  bases.forEach(function(base) {
    base.tanks.forEach(function(tank) {
      tank.showFOV = showFOV;
    });
  });
}

function __getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
