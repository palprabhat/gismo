class Base{
  constructor(canvas, obstacles, position, color, x, y, numTanks, movementNetworks, turretMovements){
    this.canvas = canvas;
    this.position = position;
    this.id = position;
    this.numTanks = numTanks;

    this.movementNetworks = movementNetworks;
    this.turretMovements = turretMovements;

    if(x !== null && y !== null){
      this.x = x;
      this.y = y;
    } else{
      this.x = this.__getRandomIntInclusive(10, this.canvas.width - 60);
      if(this.position === 0){
        this.y = this.__getRandomIntInclusive(10, 80);
      }
      else{
        this.y = this.__getRandomIntInclusive(this.canvas.height - 60, this.canvas.height - 130);
      }
    }

    this.width = 50;
    this.height = 50;
    this.color = color;
    this.health = 100;
    this.tankWidth = 20;
    this.currentIndex = 0;
    this.tanks = [];
    this.deadTanks = [];

    for (let i=0; i<this.numTanks; i++) {
      while (true){
        //top
        let rndXPos = [];
        let rndYPos = [];
        if (this.y >= 40 ) {
          while (true) {
            let rndX = this.__getRandomIntInclusive(this.x - 60, this.x + this.width + 60);
            let rndY = this.__getRandomIntInclusive(this.y - 60, this.y - this.tankWidth - 10);
            if (rndY >= 10 && (rndX>=10 && rndX <= this.canvas.width - this.tankWidth - 10)){
              rndXPos = [...rndXPos, rndX];
              rndYPos = [...rndYPos, rndY];
              break;
            }
          };
        }

        //right
        if (this.x <= this.canvas.width - this.width - 40) {
          while (true){
            let rndX = this.__getRandomIntInclusive(this.x + this.width + 10, this.x + this.width - this.tankWidth + 60);
            let rndY = this.__getRandomIntInclusive(this.y - 10, this.y + this.width + 10);
            if ((rndX <= this.canvas.width - this.tankWidth - 10) && (rndY >= 10 && rndY <= this.canvas.height - this.tankWidth - 10)){
              rndXPos = [...rndXPos, rndX];
              rndYPos = [...rndYPos, rndY];
              break;
            }
          };
        }

        //bottom
        if (this.y <= this.canvas.height - this.height - 40) {
          while (true){
            let rndX = this.__getRandomIntInclusive(this.x - 60, this.x + this.width + 60);
            let rndY = this.__getRandomIntInclusive(this.y + this.width + 10, this.y + this.width - this.tankWidth + 60);
            if ((rndY <= this.canvas.height - this.tankWidth - 10) && (rndX>=10 && rndX <= this.canvas.width - this.tankWidth - 10)){
              rndXPos = [...rndXPos, rndX];
              rndYPos = [...rndYPos, rndY];
              break;
            }
          };
        }

        //left
        if (this.x >=  40) {
          while (true){
            let rndX = this.__getRandomIntInclusive(this.x - 60, this.x - this.tankWidth - 10);
            let rndY = this.__getRandomIntInclusive(this.y - 10, this.y + this.width + 10);
            if (rndX >= 10 && (rndY >= 10 && rndY <= this.canvas.height - this.tankWidth - 10)){
              rndXPos = [...rndXPos, rndX];
              rndYPos = [...rndYPos, rndY];
              break;
            }
          };
        }

        let rndAxis = Math.floor(Math.random() * Math.floor(rndXPos.length));

        let hit = false;
        for(let tank of this.tanks){
          hit = this.canvas.collideRectRect(rndXPos[rndAxis],rndYPos[rndAxis],this.tankWidth,this.tankWidth,
                                            tank.x,tank.y,tank.width,tank.height);
          if(hit) break;
        }

        if(!hit){
          for(let obstacle of obstacles){
            hit = this.canvas.collideRectRect(rndXPos[rndAxis],rndYPos[rndAxis],this.tankWidth,this.tankWidth,
                                              obstacle.x,obstacle.y,obstacle.width,obstacle.height);
            if(hit) break;
          }
        }
        
        if(!hit){
          this.tanks.push(new Tank(canvas, rndXPos[rndAxis], rndYPos[rndAxis], this.tankWidth, this.id, 
                                  this.movementNetworks.slice(this.currentIndex, this.currentIndex + 1), this.turretMovements.slice(this.currentIndex, this.currentIndex + 1)));
          this.currentIndex += 1;
          break;
        }
      }
    }
  }

  __getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  display(obstacles) {
    this.canvas.fill(this.color);
    this.canvas.rect(this.x, this.y, this.width, this.height);

    this.tanks.forEach(function(tank){
      if(tank.health <= 0){
        let deadTank = this.tanks.splice(this.tanks.indexOf(tank), 1);
        this.deadTanks = [...this.deadTanks, deadTank[0]];
      }

      if (tank != undefined) {
        tank.display(this.color, obstacles);
      }
    }, this);
  }
}
