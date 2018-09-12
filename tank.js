class Tank{
    constructor(canvas, x, y, width){
        this.x = x;
        this.y = y;
        this.width = width;
        this.canvas = canvas;
        this.bullets = [];
        for (let i = 0; i < 150; i++){
            this.bullets.push(new Bullet(canvas));
        }
    }

    display(viewAngle=0){
        this.canvas.push();
        this.canvas.translate(this.x, this.y);
        this.rotateTurret(viewAngle);
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

    fire(){
        console.log("fire in the hole");
    }
}