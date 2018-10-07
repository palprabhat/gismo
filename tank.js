class Tank {
  constructor(canvas, x, y, width) {
    this.health = 100;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = width;
    this.canvas = canvas;
    this.decreaseHealth = true;

    let rndNumber = Math.floor(Math.random() * Math.floor(8));
    this.turretAngle = rndNumber * 45;
    this.viewAngle = 60;

    this.fovRange = Math.sqrt(this.canvas.width * this.canvas.width + this.canvas.height * this.canvas.height);

    this.movementNetwork = new NeuralNetwork(2, 6, 2, 4, 0.1);
    this.turretNetwork = new NeuralNetwork(2, 6, 2, 1, 0.1);
    this.lastObstacle;

    this.bullets = [];
    for (let i = 0; i < 50; i++) {
      this.bullets.push(new Bullet(canvas));
    }

    this.canMoveLeft = false;
    this.canMoveRight = false;
    this.canMoveUp = false;
    this.canMoveDown = false;
  }

  // private functions
  __checkCollisionDirection(
    obstacle,
    offsetLeft,
    offsetRight,
    offsetUp,
    offsetDown
  ) {
    if (
      this.x - offsetLeft < obstacle.x + obstacle.width && //left
      this.x + this.width + offsetRight > obstacle.x && //right
      this.y - offsetUp < obstacle.y + obstacle.height && //up
      this.y + this.width + offsetDown > obstacle.y //down
    ) {
      if (this.decreaseHealth) {
        if (obstacle instanceof Mountain) {
          this.health -= 20;
        } else if (obstacle instanceof Bullet) {
          this.health -= 25;
        } else if (obstacle instanceof Tank) {
          this.health -= 5;
          obstacle.health -= 5;
        } else if (obstacle instanceof Base) {
          this.health -= 10;
          obstacle.health -= 2;
        }
        this.decreaseHealth = false;
      }
      this.lastObstacle = obstacle;
      return true;
    } else {
      if (this.lastObstacle === undefined || this.lastObstacle === obstacle) {
        this.decreaseHealth = true;
      }
      return false;
    }
  }

  __rotateTurret(turretAngle) {
    this.canvas.push();
    this.canvas.translate(this.width / 2, this.width / 2);
    this.canvas.rotate(turretAngle - 45);
    this.canvas.strokeWeight(4);
    this.canvas.line(0, 0, this.width - 5, this.width - 5);
    this.canvas.pop();
  }

  __drawFOV(turretAngle, obstacles) {
    this.canvas.push();
    this.canvas.strokeWeight(1);
    this.canvas.stroke(0, 0, 0, 50);

    let x1 = this.width / 2;
    let y1 = this.width / 2;

    for(let theta = (turretAngle - this.viewAngle/2); theta <= (turretAngle + this.viewAngle/2); theta += 0.5){
      let x2 = x1 + this.fovRange * Math.cos(Math.PI * (theta)/180.0);
      let y2 = y1 + this.fovRange * Math.sin(Math.PI * (theta)/180.0);

      let x2List = [];
      let y2List = [];

      let maxDistance = Infinity;
      let maxDistanceCopy = maxDistance;

      let hit;
      for(let obstacle of obstacles){
        hit = this.canvas.collideLineRect(this.x + x1, this.y + y1, this.x + x2, this.y + y2, 
                                          obstacle.x, obstacle.y, obstacle.width, obstacle.height, true);
        
        if (typeof(hit.top.x) !== 'boolean'){
          let newDistance = this.canvas.dist(this.x + x1, this.y + y1, hit.top.x, hit.top.y);
          if(newDistance < maxDistance){
            maxDistance = newDistance;
            x2 = hit.top.x - this.x;
            y2 = hit.top.y - this.y;
          }
        }
        if (typeof(hit.right.x) !== 'boolean'){
          let newDistance = this.canvas.dist(this.x + x1, this.y + y1, hit.right.x, hit.right.y);
          if(newDistance < maxDistance){
            maxDistance = newDistance;
            x2 = hit.right.x - this.x;
            y2 = hit.right.y - this.y;
          }
        }
        if (typeof(hit.bottom.x) !== 'boolean'){
          let newDistance = this.canvas.dist(this.x + x1, this.y + y1, hit.bottom.x, hit.bottom.y);
          if(newDistance < maxDistance){
            maxDistance = newDistance;
            x2 = hit.bottom.x - this.x;
            y2 = hit.bottom.y - this.y;
          }
        }
        if (typeof(hit.left.x) !== 'boolean'){
          let newDistance = this.canvas.dist(this.x + x1, this.y + y1, hit.left.x, hit.left.y);
          if(newDistance < maxDistance){
            maxDistance = newDistance;
            x2 = hit.left.x - this.x;
            y2 = hit.left.y - this.y;
          }
        }

        if (typeof(hit.top.x) !== "boolean" || typeof(hit.bottom.x) !== "boolean" || typeof(hit.left.x) !== "boolean" || typeof(hit.right.x) !== "boolean"){
          x2List = [...x2List, x2];
          y2List = [...y2List, y2];
        }
      }

      for (let i = 0; i < x2List.length; i++){
        let newDistance = this.canvas.dist(this.x + x1, this.y + y1, this.x + x2List[i], this.y + y2List[i]);
        if(newDistance <= maxDistance){
          maxDistance = newDistance;
          x2 = x2List[i];
          y2 = y2List[i];
        }
      }
      if(maxDistance != maxDistanceCopy){
        this.canvas.line(x1, y1, x2, y2);
      }
    }
    this.canvas.pop();
  }

  __checkCollision(obstacles, direction) {
    let collide = false;
    let BreakException = {};

    try {
      obstacles.forEach(function(obstacle) {
        // left
        if (direction === 0) {
          collide = this.__checkCollisionDirection(obstacle, 2, 0, 0, 0);
        }
        // right
        if (direction === 1) {
          collide = this.__checkCollisionDirection(obstacle, 0, 2, 0, 0);
        }
        // up
        if (direction === 2) {
          collide = this.__checkCollisionDirection(obstacle, 0, 0, 2, 0);
        }
        // down
        if (direction === 3) {
          collide = this.__checkCollisionDirection(obstacle, 0, 0, 0, 2);
        }
        if (collide) {
          throw BreakException;
        }
      }, this);
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    return collide;
  }

  __move(direction) {
    switch (direction) {
      case 0:
        if (this.x > 1) {
          this.x -= 1;
        }
        break;
      case 1:
        if (this.x + this.width < this.canvas.width) {
          this.x += 1;
        }
        break;
      case 2:
        if (this.y > 1) {
          this.y -= 1;
        }
        break;
      case 3:
        if (this.y + this.width < this.canvas.height) {
          this.y += 1;
        }
        break;
    }
  }

  // public functions
  display(color, obstacles) {
    this.canvas.push();
    this.canvas.translate(this.x, this.y);
    this.__drawFOV(this.turretAngle, obstacles);
    this.__rotateTurret(this.turretAngle);
    this.canvas.fill(color);
    this.canvas.rect(0, 0, this.width, this.width);
    this.canvas.pop();
  }

  train() {
    this.movementNetwork.train(
      [Math.random(), Math.random()],
      [Math.random(), Math.random(), Math.random(), Math.random()]
    );
    this.turretNetwork.train([Math.random(), Math.random()], [Math.random()]);
  }

  predictMovementDirection() {
    return this.movementNetwork.argMax(
      this.movementNetwork.predict([this.x, this.y])
    );
  }

  moveTurret() {
    let turretMovement = this.turretNetwork.predict([this.x, this.y]);

    if (turretMovement > 0.5) {
      this.turretAngle -= 45;
    } else {
      this.turretAngle += 45;
    }
  }

  checkForCollisionAndMove(obstacles, direction) {
    if (direction === 0) {
      if (!this.__checkCollision(obstacles, direction) || this.canMoveLeft) {
        this.__move(direction);
        this.canMoveLeft = false;
        this.canMoveUp = false;
        this.canMoveDown = false;
        this.canMoveRight = false;
      } else {
        this.canMoveLeft = false;
        this.canMoveUp = true;
        this.canMoveDown = true;
        this.canMoveRight = true;
      }
    } else if (direction === 1) {
      if (!this.__checkCollision(obstacles, direction) || this.canMoveRight) {
        this.__move(direction);
        this.canMoveLeft = false;
        this.canMoveUp = false;
        this.canMoveDown = false;
        this.canMoveRight = false;
      } else {
        this.canMoveLeft = true;
        this.canMoveUp = true;
        this.canMoveDown = true;
        this.canMoveRight = false;
      }
    } else if (direction === 2) {
      if (!this.__checkCollision(obstacles, direction) || this.canMoveUp) {
        this.__move(direction);
        this.canMoveLeft = false;
        this.canMoveUp = false;
        this.canMoveDown = false;
        this.canMoveRight = false;
      } else {
        this.canMoveLeft = true;
        this.canMoveUp = false;
        this.canMoveDown = true;
        this.canMoveRight = true;
      }
    } else {
      if (!this.__checkCollision(obstacles, direction) || this.canMoveDown) {
        this.__move(direction);
        this.canMoveLeft = false;
        this.canMoveUp = false;
        this.canMoveDown = false;
        this.canMoveRight = false;
      } else {
        this.canMoveLeft = true;
        this.canMoveUp = true;
        this.canMoveDown = false;
        this.canMoveRight = true;
      }
    }
  }

  fire() {
    console.log("fire in the hole");
  }
}
