class Mountain {
  constructor(canvas, x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.canvas = canvas;
  }

  display() {
    this.canvas.fill(this.color);
    this.canvas.rect(this.x, this.y, this.width, this.height);
  }
}
