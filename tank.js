class Tank{
    constructor(canvas, x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.canvas = canvas;
    }

    display(){
        this.canvas.push();
        this.canvas.translate(this.x, this.y);
        this.canvas.push();
        this.canvas.translate(this.width/2, this.width/2);
        this.rotateTurret(45);
        this.canvas.rect(0, 0, this.width, this.height);
        this.canvas.pop();
    }

    collide(obstacle) {

    }

    rotateTurret(angle){
        this.canvas.rotate(angle - 45);
        this.canvas.strokeWeight(4);
        this.canvas.line(0, 0, this.width-5, this.height-5);
        this.canvas.pop();
    }
}