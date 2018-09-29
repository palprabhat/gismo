class Tank {
  constructor(canvas, x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.centerX = (this.x + this.width) / 2;
    this.centerY = (this.y + this.width) / 2;
    this.halfWidth = this.halfHeight = this.width / 2;
    this.canvas = canvas;
    this.viewAngle = 0;
    this.movementNetwork = new NeuralNetwork(2, 6, 2, 4, 0.1);
    this.turretNetwork = new NeuralNetwork(2, 6, 2, 1, 0.1);
    this.bullets = [];
    for (let i = 0; i < 150; i++) {
      this.bullets.push(new Bullet(canvas));
    }
  }

  display(team) {
    this.canvas.push();
    this.canvas.translate(this.x, this.y);
    this.__rotateTurret(this.viewAngle);
    if (team == "1") {
      this.canvas.fill(249, 67, 54);
    } else {
      this.canvas.fill(66, 80, 244);
    }
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

  move() {
    let move = this.movementNetwork.argMax(
      this.movementNetwork.predict([this.x, this.y])
    );

    switch (move) {
      case 0:
        if (this.x < 1) {
          this.x -= 1;
        }
        break;
      case 1:
        if (this.x + this.width < this.canvas.width) {
          this.x += 1;
        }
        break;
      case 2:
        if (this.y < 1) {
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

  moveTurret() {
    let turretMovement = this.turretNetwork.predict([this.x, this.y]);

    if (turretMovement > 0.5) {
      this.viewAngle -= 45;
    } else {
      this.viewAngle += 45;
    }
  }

  __collisionHelper(obstacle) {
    //if I keep moving in my current X direction, will I collide with the center rectangle?
    if (
      this.x + this.width + 1 > obstacle.x &&
      this.x + 1 < obstacle.x + obstacle.width &&
      this.y + this.width > obstacle.y &&
      this.y < obstacle.y + obstacle.height
    ) {
      this.x = this.x;
    }
    //if I keep moving in my current Y direction, will I collide with the center rectangle?
    if (
      this.x + this.width > obstacle.x &&
      this.x < obstacle.x + obstacle.width &&
      this.y + this.width + 1 > obstacle.y &&
      this.y + 1 < obstacle.y + obstacle.height
    ) {
      // this.y =
    }
  }

  __checkCollisionLeft(obstacle) {
    if (
      this.x + this.width > obstacle.x && //right
      this.x - 2 < obstacle.x + obstacle.width && //left
      this.y + this.width > obstacle.y && //up
      this.y < obstacle.y + obstacle.height //down
    ) {
      return true;
    }
    return false;
  }

  __checkCollisionRight(obstacle) {
    if (
      this.x + this.width + 2 > obstacle.x &&
      this.x < obstacle.x + obstacle.width &&
      this.y + this.width > obstacle.y &&
      this.y < obstacle.y + obstacle.height
    ) {
      return true;
    }
    return false;
  }

  __checkCollisionUp(obstacle) {
    //if I keep moving in my current Y direction, will I collide with the center rectangle?
    if (
      this.x + this.width > obstacle.x &&
      this.x < obstacle.x + obstacle.width &&
      this.y + this.width > obstacle.y &&
      this.y - 2 < obstacle.y + obstacle.height
    ) {
      return true;
    }
    return false;
  }
  __checkCollisionDown(obstacle) {
    //if I keep moving in my current Y direction, will I collide with the center rectangle?
    if (
      this.x + this.width > obstacle.x &&
      this.x < obstacle.x + obstacle.width &&
      this.y + this.width + 2 > obstacle.y &&
      this.y < obstacle.y + obstacle.height
    ) {
      return true;
    }
    return false;
  }

  checkCollision(obstacle, direction) {
    // Up
    if (direction == 0) {
      return this.__checkCollisionUp(obstacle);
    }
    // Down
    if (direction == 1) {
      return this.__checkCollisionDown(obstacle);
    }
    // Left
    if (direction == 2) {
      return this.__checkCollisionLeft(obstacle);
    }
    // Right
    if (direction == 3) {
      return this.__checkCollisionRight(obstacle);
    }
  }

  // collide(obstacle) {
  //   let hit = false;
  //   switch (obstacle.constructor.name) {
  //     case "Base":
  //     case "Tank":
  //     case "Mountain":
  //       hit = this.canvas.collideRectRect(
  //         this.x,
  //         this.y,
  //         this.width,
  //         this.width,
  //         obstacle.x,
  //         obstacle.y,
  //         obstacle.width,
  //         obstacle.height
  //       );
  //       if (hit) {
  //         // call the collision helper
  //         this.__collisionHelper(obstacle);
  //       }
  //       break;

  //     default:
  //       console.log("Tank class collision malfunction!..");
  //   }
  //   // return hit;
  // }

  __rotateTurret(viewAngle) {
    this.canvas.push();
    this.canvas.translate(this.width / 2, this.width / 2);
    this.canvas.rotate(viewAngle - 45);
    this.canvas.strokeWeight(4);
    this.canvas.line(0, 0, this.width - 5, this.width - 5);
    this.canvas.pop();
  }

  fire() {
    console.log("fire in the hole");
  }
}
