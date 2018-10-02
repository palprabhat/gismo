class Tank {
  constructor(canvas, x, y, width) {
    this.health = 100;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = width
    this.canvas = canvas;
    this.decreaseHealth = true;

    let rndNumber = Math.floor(Math.random() * Math.floor(8));
    this.viewAngle = rndNumber * 45;

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
  __checkCollisionDirection(obstacle, offsetLeft, offsetRight, offsetUp, offsetDown) {
    if (
      this.x - offsetLeft < obstacle.x + obstacle.width && //left
      this.x + this.width + offsetRight > obstacle.x && //right
      this.y - offsetUp < obstacle.y + obstacle.height && //up
      this.y + this.width + offsetDown > obstacle.y //down
    ) {
      if(this.decreaseHealth){
        if(obstacle instanceof Mountain){
          this.health -= 20;
        }
        else if (obstacle instanceof Bullet){
          this.health -=25;
        }
        else if (obstacle instanceof Tank){
          this.health -=5;
          obstacle.health -=5;
        }
        else if (obstacle instanceof Base){
          this.health -=10;
          obstacle.health -= 2;
        }
        this.decreaseHealth = false;
      }
      this.lastObstacle = obstacle;
      return true;
    }
    else {
      if(this.lastObstacle === undefined || this.lastObstacle === obstacle){
        this.decreaseHealth = true;
      }
      return false;
    }
  }
  
  __rotateTurret(viewAngle) {
    this.canvas.push();
    this.canvas.translate(this.width / 2, this.width / 2);
    this.canvas.rotate(viewAngle - 45);
    this.canvas.strokeWeight(4);
    this.canvas.line(0, 0, this.width - 5, this.width - 5);
    this.canvas.pop();
  }

  __checkCollision(obstacles, direction) {
    let collide = false;
    let BreakException = {};

    try{
      obstacles.forEach(function(obstacle){
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
        if(collide){
          throw BreakException;
        }
      }, this);
    } catch (e){
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
  display(color) {
    this.canvas.push();
    this.canvas.translate(this.x, this.y);
    this.__rotateTurret(this.viewAngle);
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
    return this.movementNetwork.argMax(this.movementNetwork.predict([this.x, this.y]));
  }

  moveTurret() {
    let turretMovement = this.turretNetwork.predict([this.x, this.y]);

    if (turretMovement > 0.5) {
      this.viewAngle -= 45;
    } else {
      this.viewAngle += 45;
    }
  }

  checkForCollisionAndMove(obstacles, direction){
    if (direction === 0){
      if (!(this.__checkCollision(obstacles, direction)) || this.canMoveLeft){
        this.__move(direction);
        this.canMoveLeft = false;
        this.canMoveUp = false;
        this.canMoveDown = false;
        this.canMoveRight = false;
      }
      else{
        this.canMoveLeft = false;
        this.canMoveUp = true;
        this.canMoveDown = true;
        this.canMoveRight = true;
      }
    }
    else if (direction === 1){
      if (!(this.__checkCollision(obstacles, direction)) || this.canMoveRight){
        this.__move(direction);
        this.canMoveLeft = false;
        this.canMoveUp = false;
        this.canMoveDown = false;
        this.canMoveRight = false;
      }
      else{
        this.canMoveLeft = true;
        this.canMoveUp = true;
        this.canMoveDown = true;
        this.canMoveRight = false;
      }
    }
    else if (direction === 2){
      if (!(this.__checkCollision(obstacles, direction)) || this.canMoveUp){
        this.__move(direction);
        this.canMoveLeft = false;
        this.canMoveUp = false;
        this.canMoveDown = false;
        this.canMoveRight = false;
      }
      else{
        this.canMoveLeft = true;
        this.canMoveUp = false;
        this.canMoveDown = true;
        this.canMoveRight = true;
      }
    } 
    else{
      if (!(this.__checkCollision(obstacles, direction)) || this.canMoveDown){
        this.__move(direction);
        this.canMoveLeft = false;
        this.canMoveUp = false;
        this.canMoveDown = false;
        this.canMoveRight = false;
      }
      else{
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