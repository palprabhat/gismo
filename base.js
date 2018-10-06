class Base {
  constructor(canvas, position, color) {
    this.position = position;
    if (this.position === 0) {
      this.x = 10;
      this.y = 10;
    } else {
      this.x = 580;
      this.y = 420;
    }

    this.width = 50;
    this.height = 50;
    this.canvas = canvas;
    this.color = color;
    this.health = 100;
    this.tankWidth = 20;
    const numTanks = 2;
    this.tanks = [];
    if (this.position === 0) {
      for (let i = 0; i < numTanks; i++) {
        let rndX1 = this.__getRandomIntInclusive(
          this.x + 55,
          this.x + 105 - this.tankWidth
        );
        let rndY1 = this.__getRandomIntInclusive(this.y, this.y + 55);

        let rndX2 = this.__getRandomIntInclusive(this.x, this.x + 105);
        let rndY2 = this.__getRandomIntInclusive(
          this.y + 55,
          this.y + 105 - this.tankWidth
        );

        let rndAxis = Math.floor(Math.random() * Math.floor(2));

        if (rndAxis === 0) {
          this.tanks.push(new Tank(canvas, rndX1, rndY1, this.tankWidth));
        } else {
          this.tanks.push(new Tank(canvas, rndX2, rndY2, this.tankWidth));
        }
      }
    } else {
      for (let i = 0; i < numTanks; i++) {
        let rndX1 = this.__getRandomIntInclusive(
          this.x - 55,
          this.x - 5 - this.tankWidth
        );
        let rndY1 = this.__getRandomIntInclusive(
          this.y - 55,
          this.y + this.width - this.tankWidth
        );

        let rndX2 = this.__getRandomIntInclusive(
          this.x - 5,
          this.x + this.width - this.tankWidth
        );
        let rndY2 =
          this.__getRandomIntInclusive(this.y - 55, this.y - 5) -
          this.tankWidth;

        let rndAxis = Math.floor(Math.random() * Math.floor(2));

        if (rndAxis == 0) {
          this.tanks.push(new Tank(canvas, rndX1, rndY1, this.tankWidth));
        } else {
          this.tanks.push(new Tank(canvas, rndX2, rndY2, this.tankWidth));
        }
      }
    }
  }

  __getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  display() {
    this.canvas.fill(this.color);
    this.canvas.rect(this.x, this.y, this.width, this.height);

    this.tanks.forEach(function(tank) {
      if (tank.health === 0) {
        let deadTank = this.tanks.splice(this.tanks.indexOf(tank), 1);
        console.log(deadTank);
      }

      if (tank != undefined) {
        tank.display(this.color);
      }
    }, this);
  }
}
