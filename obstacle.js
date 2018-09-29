class Mountain {
  constructor(canvas, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.centerX = (this.x + this.width) / 2;
    this.centerY = (this.y + this.height) / 2;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;

    this.canvas = canvas;
  }

  display() {
    this.canvas.rect(this.x, this.y, this.width, this.height);
  }
}
