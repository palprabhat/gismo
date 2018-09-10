class Bullet {
    constructor(canvas){
        this.canvas = canvas;
    }

    display(){
        this.canvas.line(0, 0, 5, 5);
    }
}