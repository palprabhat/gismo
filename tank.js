class Tank {
  constructor(canvas, x, y, width, id, movementNetwork, turretNetwork) {
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
    this.turretAngle = rndNumber * 45;
    this.viewAngle = 60;
    this.fovRange = this.diagonal;
    this.showFOV = false;
    this.vision = [];
    this.collided = false;
    this.speed = 1;

    this.pos = this.canvas.createVector(x + Math.cos(Math.PI*(this.turretAngle/180)), 
																				y + Math.sin(Math.PI*(this.turretAngle/180)));

    this.lastObstacle;
    this.stop = [false, false, false, false]; // [stopLeft, stopRight, stopUp, stopDown]
    this.currentCollision = [null, null, null, null]; // [Left, Right, Up, Down]

    this.movementNetwork = movementNetwork[0];
    this.turretNetwork = turretNetwork[0];
  }

  // private functions
  __rotateTurret(turretAngle) {
    this.canvas.push();
    this.canvas.translate(this.width / 2, this.width / 2);
    this.canvas.rotate(turretAngle - 45);
    this.canvas.strokeWeight(4);
    // this.canvas.rotate(45);
    this.canvas.line(0, 0, 15, 15);
    this.canvas.pop();
  }

  __drawFOV(turretAngle, obstacles) {
    this.canvas.push();
    // this.canvas.rotate(-this.turretAngle);
    // this.canvas.translate(this.width, this.width);
    this.canvas.strokeWeight(1);
    this.canvas.stroke(0, 0, 0, 50);

    let x1 = this.width / 2;
    let y1 = this.width / 2;
    this.vision = [];
    let oneHotVision = [];

    for (let theta = turretAngle - this.viewAngle / 2; theta <= turretAngle + this.viewAngle / 2; theta += 0.5) {
      
      let x2 = x1 + this.fovRange * Math.cos((Math.PI * theta) / 180.0);
      let y2 = y1 + this.fovRange * Math.sin((Math.PI * theta) / 180.0);

      let x2List = [];
      let y2List = [];
      let obs = [];
      let obst = [1, 0, 0, 0, 0, 0, 0]; //[D, FT, OT, FB, OB, M, B]

      let maxDistance = Infinity;
      let maxDistanceCopy = maxDistance;

      let hit;
      let obstaclesToCheck = obstacles.filter(t => t != this);
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

  // public functions
  display(color, obstacles) {
    this.x = this.pos.x;
    this.y = this.pos.y;
    this.canvas.push();
    this.canvas.translate(this.x, this.y);
    // this.canvas.rectMode(this.canvas.CENTER)
    // this.canvas.rotate(this.turretAngle);
    this.__drawFOV(this.turretAngle, obstacles);
    this.__rotateTurret(this.turretAngle);
    this.canvas.fill(color);
    this.canvas.rect(0, 0, this.width, this.width);
    this.canvas.pop();
  }

  predictMovement() {
    return this.movementNetwork.predict(this.vision.flat(2));
  }

  mutate() {
    function fn(x) {
      if (Math.random() < 0.05) {
        let offset = Math.floor(Math.random() * 2) - 0.5;
        let newx = x + offset;
        return newx;
      }
      return x;
    }

    let ih = this.movementNetwork.input_weights.dataSync().map(fn);
    let ih_shape = this.movementNetwork.input_weights.shape;
    this.movementNetwork.input_weights.dispose();
    this.movementNetwork.input_weights = tf.tensor(ih, ih_shape);

    let ho = this.movementNetwork.output_weights.dataSync().map(fn);
    let ho_shape = this.movementNetwork.output_weights.shape;
    this.movementNetwork.output_weights.dispose();
    this.movementNetwork.output_weights = tf.tensor(ho, ho_shape);

    ih = this.turretNetwork.input_weights.dataSync().map(fn);
    ih_shape = this.turretNetwork.input_weights.shape;
    this.turretNetwork.input_weights.dispose();
    this.turretNetwork.input_weights = tf.tensor(ih, ih_shape);

    ho = this.turretNetwork.output_weights.dataSync().map(fn);
    ho_shape = this.turretNetwork.output_weights.shape;
    this.turretNetwork.output_weights.dispose();
    this.turretNetwork.output_weights = tf.tensor(ho, ho_shape);
  }

  moveTurret() {
    let turretMovement = this.turretNetwork.predict(this.vision.flat(2));
    if (turretMovement === 1) {
      this.turretAngle -= 1;
    } else if (turretMovement === 2) {
      this.turretAngle += 1;
    }
  }

  checkForCollisionAndMove(obstacles) {
    this.prevPos = this.pos.copy();
    this.vel = p5.Vector.fromAngle(this.canvas.radians(this.turretAngle));
    this.vel.mult(this.speed);
    this.pos.add(this.vel);

    if (this.collided){
      this.x = this.pos.x;
      this.y = this.pos.y;
    }
    else {
      this.x = this.pos.x;
      this.y = this.pos.y;
    }

    let hit = false;
    for (let obstacle of obstacles){
      hit = this.canvas.collideRectRect(this.x, this.y, this.width, this.width, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      if(hit){
        if (this.decreaseHealth) {
          if (obstacle instanceof Mountain) {
            this.health -= 20;
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

    if (hit){
      this.vel = p5.Vector.fromAngle(this.canvas.radians(180+this.turretAngle));
      this.vel.mult(this.speed);
      this.pos.add(this.vel);
      this.collided=true; 
    }
    else{
      this.vel = p5.Vector.fromAngle(this.canvas.radians(this.turretAngle));
      this.vel.mult(this.speed);
      this.pos.add(this.vel);
      this.collided=false;
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
}
