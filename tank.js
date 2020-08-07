class Tank {
  constructor(canvas, x, y, width, id, movementNetwork, turretNetwork, dnaPool, obstaclesLength) {
    this.x = x;
    this.y = y;
    
    this.width = width;
    this.height = width;
    this.canvas = canvas;
    this.id = id;
    this.diagonal = Math.sqrt(
      Math.pow(this.canvas.width, 2) + Math.pow(this.canvas.height, 2)
    );

    this.bullets = [];
    this.bulletCount = 50;
    this.bulletRange = 350;
    this.targetsHit = [];

    this.health = 100;
    this.decreaseHealth = true;
    this.causeOfDeath;

    let rndNumber = Math.floor(Math.random() * Math.floor(8));

    if(this.id === 0){
      this.turretAngle = __getRandomIntInclusive(30, 150);
    }
    else {
      this.turretAngle = __getRandomIntInclusive(210, 330);
    }
    this.viewAngle = 60;
    this.fovRange = this.diagonal;
    this.showFOV = false;
    this.vision = [];
    this.collided = false;
    this.speed = 2;
    this.vision1 = new Array(13);

    this.dna = dnaPool[0];
    this.geneCounter = 0;
    
    this.acc = this.canvas.createVector();
    this.vel = this.canvas.createVector();

    this.pos = this.canvas.createVector(this.x, this.y);

    this.lastObstacle;
    this.stop = [false, false, false, false]; // [stopLeft, stopRight, stopUp, stopDown]
    this.currentCollision = [null, null, null, null]; // [Left, Right, Up, Down]
    this.movementFitness = 0;
  }

  __rotateTurret(turretAngle) {
    this.canvas.push();
    this.canvas.translate(this.width / 2, this.width / 2);
    this.canvas.rotate(turretAngle - 45);
    this.canvas.strokeWeight(4);
    this.canvas.line(0, 0, 15, 15);
    this.canvas.pop();
  }

  __drawFOV(turretAngle, obstacles) {
    this.canvas.push();
    this.canvas.strokeWeight(1);
    this.canvas.stroke(0, 0, 0, 50);

    let x1 = this.width / 2;
    let y1 = this.width / 2;
    this.vision = [];
    this.vision1.fill(0);
    let oneHotVision = [];

    let obstaclesMountains = obstacles.filter(m => m instanceof Mountain);

    for (let i = 0; i < obstaclesMountains.length; i++){
      let d = this.canvas.dist(this.x + x1, this.y + y1, obstaclesMountains[i].x + (obstaclesMountains[i].width/2), obstaclesMountains[i].y + (obstaclesMountains[i].width/2));
      this.vision1[i] = d/this.diagonal;
    }

    let obstaclesTanks = obstacles.filter(t => t instanceof Tank && t != this);
    for (let i = obstaclesMountains.length; i < obstaclesMountains.length + obstaclesTanks.length; i++){
      let k = i - obstaclesMountains.length;
      let d = this.canvas.dist(this.x + x1, this.y + y1, obstaclesTanks[k].x + x1, obstaclesTanks[k].y + y1);
      this.vision1[i] = d/this.diagonal;
    }

    let obstaclesBases = obstacles.filter(b => b instanceof Base);
    let thershold = obstaclesMountains.length + obstaclesTanks.length;
    for (let i = thershold; i < thershold + obstaclesBases.length; i++){
      let k = i - thershold;
      let d = this.canvas.dist(this.x + x1, this.y + y1, obstaclesBases[k].x + (obstaclesBases[k].width/2), obstaclesBases[k].y + (obstaclesBases[k].width/2));
      this.vision1[i] = d/this.diagonal;
    }


    for (let theta = turretAngle - this.viewAngle / 2; theta <= turretAngle + this.viewAngle / 2; theta += 1) {
      let x2 = x1 + this.fovRange * Math.cos((Math.PI * theta) / 180.0);
      let y2 = y1 + this.fovRange * Math.sin((Math.PI * theta) / 180.0);

      let x2List = [];
      let y2List = [];
      let obs = [];
      let obst = [1, 0, 0, 0, 0, 0, 0]; //[Dist, FT, OT, FB, OB, Mountain, Bullet]

      let maxDistance = Infinity;
      let maxDistanceCopy = maxDistance;

      let hit;
      let obstaclesToChk = obstacles.filter(t => t != this);
      let obstaclesToCheck = obstaclesToChk.filter(m => !(m instanceof Mountain));

      for (let obstacle of obstaclesToCheck) {
        if (obstacle instanceof Bullet) {
          hit = this.canvas.collidePointLine(obstacle.pos.x, obstacle.pos.y, this.x + x1, this.y + y1, this.x + x2, this.y + y2);
          if (hit) {
            let newDistance = this.canvas.dist(this.x + x1, this.y + y1, obstacle.pos.x, obstacle.pos.y);
            if (newDistance < maxDistance) {
              maxDistance = newDistance;
              x2 = obstacle.pos.x - this.x;
              y2 = obstacle.pos.y - this.y;
              x2List = [...x2List, x2];
              y2List = [...y2List, y2];
              obs = [...obs, [maxDistance / this.diagonal, 0, 0, 0, 0, 0, 1]];
            }
          }
        } else {
          hit = this.canvas.collideLineRect(this.x + x1, this.y + y1, this.x + x2, this.y + y2, obstacle.x, obstacle.y, obstacle.width, obstacle.height, true);
          if (typeof hit.top.x !== "boolean") {
            let newDistance = this.canvas.dist(this.x + x1, this.y + y1, hit.top.x, hit.top.y);
            if (newDistance < maxDistance) {
              maxDistance = newDistance;
              x2 = hit.top.x - this.x;
              y2 = hit.top.y - this.y;
            }
          }
          if (typeof hit.right.x !== "boolean") {
            let newDistance = this.canvas.dist(this.x + x1, this.y + y1, hit.right.x, hit.right.y);
            if (newDistance < maxDistance) {
              maxDistance = newDistance;
              x2 = hit.right.x - this.x;
              y2 = hit.right.y - this.y;
            }
          }
          if (typeof hit.bottom.x !== "boolean") {
            let newDistance = this.canvas.dist(this.x + x1, this.y + y1, hit.bottom.x, hit.bottom.y);
            if (newDistance < maxDistance) {
              maxDistance = newDistance;
              x2 = hit.bottom.x - this.x;
              y2 = hit.bottom.y - this.y;
            }
          }
          if (typeof hit.left.x !== "boolean") {
            let newDistance = this.canvas.dist(this.x + x1, this.y + y1, hit.left.x, hit.left.y);
            if (newDistance < maxDistance) {
              maxDistance = newDistance;
              x2 = hit.left.x - this.x;
              y2 = hit.left.y - this.y;
            }
          }

          if (typeof hit.top.x !== "boolean" || typeof hit.bottom.x !== "boolean" || typeof hit.left.x !== "boolean" || typeof hit.right.x !== "boolean") {
            x2List = [...x2List, x2];
            y2List = [...y2List, y2];
            if (obstacle instanceof Mountain) {
              obs = [...obs, [maxDistance / this.diagonal, 0, 0, 0, 0, 1, 0]];
            } else if (obstacle instanceof Base) {
              if (this.id != obstacle.id) {
                obs = [...obs, [maxDistance / this.diagonal, 0, 0, 0, 1, 0, 0]]; //opponent base
                if (theta === turretAngle && maxDistance < this.bulletRange){
                  this.fire();
                }
              } else {
                obs = [...obs, [maxDistance / this.diagonal, 0, 0, 1, 0, 0, 0]]; //friendly base
              }
            } else if (obstacle instanceof Tank) {
              if (this.id != obstacle.id) {
                obs = [...obs, [maxDistance / this.diagonal, 0, 1, 0, 0, 0, 0]]; //opponent tank
                if (theta === turretAngle && maxDistance < this.bulletRange){
                  this.fire();
                }
              } else {
                obs = [...obs, [maxDistance / this.diagonal, 1, 0, 0, 0, 0, 0]]; //friendly tank
              }
            }
          }
        }
      }

      for (let i = 0; i < x2List.length; i++) {
        let newDistance = this.canvas.dist(this.x + x1, this.y + y1, this.x + x2List[i], this.y + y2List[i]);
        if (newDistance <= maxDistance) {
          maxDistance = newDistance;
          x2 = x2List[i];
          y2 = y2List[i];
          obst = obs[i];
        }
      }
      if (this.showFOV) {
        if (maxDistance != maxDistanceCopy) {
          this.canvas.line(x1, y1, x2, y2);
        }
      }
      oneHotVision = [...oneHotVision, obst];
    }
    this.vision = [...this.vision, oneHotVision];
    this.canvas.pop();
  }


  display(color, obstacles) {
    this.turretAngle = this.getAngle();
    this.x = this.pos.x;
    this.y = this.pos.y;
    this.canvas.push();
    this.canvas.translate(this.x, this.y);
    this.__drawFOV(this.turretAngle, obstacles);
    this.__rotateTurret(this.turretAngle);
    this.canvas.fill(color);
    this.canvas.rect(0, 0, this.width, this.width);
    this.canvas.pop();
  }

  checkForCollisionAndMove(obstacles) {
    let hit = false;
    for (let obstacle of obstacles){
      hit = this.canvas.collideRectRect(this.x, this.y, this.width, this.width, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      if(hit){
        if (this.decreaseHealth) {
          if (obstacle instanceof Mountain) {
            this.health = 0;
          } else if (obstacle instanceof Tank) {
            this.health -= 5;
            obstacle.health -= 5;
          } else if (obstacle instanceof Base) {
            this.health -= 10;
            obstacle.health -= 2;
          }
          if (this.health <= 0) {
            this.causeOfDeath = { obstacle };
          }
          this.decreaseHealth = false;
        }
        this.lastObstacle = obstacle;
        break;
      }
      else {
        if (this.lastObstacle === undefined || this.lastObstacle === obstacle) {
          this.decreaseHealth = true;
        }
      }
    };

    if (!hit){
      if(this.x <= 0 || this.x + this.width >= this.canvas.width || this.y <= 0 || this.y + this.width >= this.canvas.height) {
        hit = true;
        this.health = 0;
      }
    }

    if (hit) {
      this.vel = p5.Vector.fromAngle(this.canvas.radians(180+this.turretAngle));
      this.pos.add(this.vel);
    }
    else{
      this.acc.add(this.dna.genes[this.geneCounter]);
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.geneCounter = (this.geneCounter + 1) % this.dna.genes.length;
    }
  }

  fire() { 
    if(this.bulletCount > 0 && this.bullets.length == 0){
      this.bullets.push(new Bullet(this.canvas, this.id, this.x + 10, this.y + 10, this.turretAngle, this.bulletRange));
      this.bulletCount--;
    } else if (this.bulletCount <= 0) {
      console.log("Out of ammo !!");
    }
  }

  getAngle(){
    let angle = Math.atan2(this.vel.y, this.vel.x);
    return angle * 45;
  }

  __getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }
}
