class Tank{
    constructor(canvas, x, y, width, viewAngle){
        this.x = x;
        this.y = y;
        this.width = width;
        this.viewAngle = viewAngle;
        this.canvas = canvas;
    }

    display(){
        this.canvas.push();
        this.canvas.translate(this.x, this.y);
        this.rotateTurret(this.viewAngle);
        this.canvas.rect(0, 0, this.width, this.width);
        this.canvas.pop();
    }

    collide(obstacle) {

    }

    rotateTurret(viewAngle){
        this.canvas.push();
        this.canvas.translate(this.width/2, this.width/2);
        this.canvas.rotate(viewAngle - 45);
        this.canvas.strokeWeight(4);
        this.canvas.line(0, 0, this.width-5, this.width-5);
        this.canvas.pop();
    }
}