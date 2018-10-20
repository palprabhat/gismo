class Tank {
  constructor(canvas, x, y, width, id) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = width;
    this.canvas = canvas;
    this.id = id;
    this.diagonal = Math.sqrt(Math.pow(this.canvas.width, 2) + Math.pow(this.canvas.height, 2));

    this.bullets = [];
    this.bulletCount = 50;
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
    
    this.lastObstacle;
    this.stop = [false, false, false, false]; // [stopLeft, stopRight, stopUp, stopDown]
    this.currentCollision = [null, null, null, null]; // [Left, Right, Up, Down]

    this.movementFitness = 0;
    this.turretFitness = 0;
    this.fireFitness = 0;

    this.movementNetwork = new NeuralNetwork(847, 121, 2, 4, 0.1);
    this.turretNetwork = new NeuralNetwork(847, 121, 2, 1, 0.1);
    this.fireNetwork = new NeuralNetwork(847, 121, 2, 1, 0.1);
  }

  // private functions
  __checkCollisionDirection(obstacle, offsetLeft, offsetRight, offsetUp, offsetDown) {
    if (
      this.x - offsetLeft < obstacle.x + obstacle.width && //left
      this.x + this.width + offsetRight > obstacle.x && //right
      this.y - offsetUp < obstacle.y + obstacle.height && //up
      this.y + this.width + offsetDown > obstacle.y //down
    ) {
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
        if(this.health <= 0){
          this.causeOfDeath = {obstacle};
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
    this.vision = [];
    let oneHotVision = [];

    for(let theta = (turretAngle - this.viewAngle/2); theta <= (turretAngle + this.viewAngle/2); theta += 0.5){
      let x2 = x1 + this.fovRange * Math.cos(Math.PI * (theta)/180.0);
      let y2 = y1 + this.fovRange * Math.sin(Math.PI * (theta)/180.0);

      let x2List = [];
      let y2List = [];
      let obs = [];
      let obst = [1,0,0,0,0,0,0]; //[D, FT, OT, FB, OB, M, B]

      let maxDistance = Infinity;
      let maxDistanceCopy = maxDistance;

      let hit;
      let obstaclesToCheck = obstacles.filter(t => t !=  this)
      for(let obstacle of obstaclesToCheck){
        if(obstacle instanceof Bullet) {
          hit = this.canvas.collidePointLine(obstacle.pos.x,obstacle.pos.y,
                                            this.x + x1, this.y + y1, this.x + x2, this.y + y2);
          if(hit){
            let newDistance = this.canvas.dist(this.x + x1, this.y + y1, obstacle.pos.x, obstacle.pos.y);
            if(newDistance < maxDistance){
              maxDistance = newDistance;
              x2 = obstacle.pos.x - this.x;
              y2 = obstacle.pos.y - this.y;
              x2List = [...x2List, x2];
              y2List = [...y2List, y2];
              obs = [...obs, [maxDistance/this.diagonal,0,0,0,0,0,1]];
            }
          }                         
        } 
        else {
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
            if (obstacle instanceof Mountain) {
              obs = [...obs, [maxDistance/this.diagonal,0,0,0,0,1,0]];
            } else if (obstacle instanceof Base) {
              if (this.id != obstacle.id){
                obs = [...obs, [maxDistance/this.diagonal,0,0,0,1,0,0]]; //opponent base
              } else {
                obs = [...obs, [maxDistance/this.diagonal,0,0,1,0,0,0]]; //friendly base
              }
            } else if (obstacle instanceof Tank) {
              if (this.id != obstacle.id){
                obs = [...obs, [maxDistance/this.diagonal,0,1,0,0,0,0]]; //opponent tank
              } else {
                obs = [...obs, [maxDistance/this.diagonal,1,0,0,0,0,0]]; //friendly tank
              }
            }
          }
        }
      }

      for (let i = 0; i < x2List.length; i++){
        let newDistance = this.canvas.dist(this.x + x1, this.y + y1, this.x + x2List[i], this.y + y2List[i]);
        if(newDistance <= maxDistance){
          maxDistance = newDistance;
          x2 = x2List[i];
          y2 = y2List[i];
          obst = obs[i];
        }
      }
      if(this.showFOV){
        if(maxDistance != maxDistanceCopy){
          this.canvas.line(x1, y1, x2, y2);
        }
      }
      oneHotVision = [...oneHotVision, obst];
    }
    this.vision = [...this.vision, oneHotVision];
    this.canvas.pop();
  }

  __checkCollision(obstacles, direction) {
    let collide = false;

    for(let obstacle of obstacles){
      if (direction === 0) { // left
        collide = this.__checkCollisionDirection(obstacle, 2, 0, 0, 0);
      } else
      if (direction === 1) { // right
        collide = this.__checkCollisionDirection(obstacle, 0, 2, 0, 0);
      } else
      if (direction === 2) { // up
        collide = this.__checkCollisionDirection(obstacle, 0, 0, 2, 0);
      } else
      if (direction === 3) { // down
        collide = this.__checkCollisionDirection(obstacle, 0, 0, 0, 2);
      }
      if (collide) {
        this.currentCollision[direction] = obstacle;
        break;
      }
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
        if (this.x + this.width < this.canvas.width - 1) {
          this.x += 1;
        }
        break;
      case 2:
        if (this.y > 1) {
          this.y -= 1;
        }
        break;
      case 3:
        if (this.y + this.width < this.canvas.height - 1) {
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
      this.vision.flat(2),
      [Math.random(), Math.random(), Math.random(), Math.random()]
    );
    this.turretNetwork.train(this.vision.flat(2), [Math.random()]);
  }

  predictMovementDirection() {
    return this.movementNetwork.argMax(
      this.movementNetwork.predict(this.vision.flat(2))
    );
  }

  moveTurret() {
    let turretMovement = this.turretNetwork.predict(this.vision.flat(2));

    if (turretMovement > 0.5) {
      this.turretAngle -= 45;
    } else {
      this.turretAngle += 45;
    }
  }

  checkForCollisionAndMove(obstacles, direction) {
    let oppDirection= (direction === 0) ? 1 : (direction === 1) ? 0 : (direction === 2) ? 3 : 2;

    if (!this.__checkCollision(obstacles, direction) || this.stop[direction]) { // no collision
      this.stop.fill(false);
      this.currentCollision[oppDirection] = null;
      if (this.currentCollision[direction] === null){
        this.__move(direction);
      } else {
        if(!this.canvas.collideRectRect(this.currentCollision[direction].x, this.currentCollision[direction].y, this.currentCollision[direction].width, this.currentCollision[direction].height,
                                       this.x, this.y, this.width, this.width)){
          this.currentCollision[direction] = null;
          this.__move(direction);
        }
      }
    } else { // collision
      this.stop.fill(true);
      this.stop[direction] = false;
    }
  }

  fire() { 
    if(this.bulletCount > 0){
      this.bullets.push(new Bullet(this.canvas, this.id, this.x + 10, this.y + 10, this.turretAngle));
      this.bulletCount--;
    }
    else{
      console.log("out of ammo");
    }
  }
}
