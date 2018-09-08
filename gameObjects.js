class Mountain{
    constructor(canvas, x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.canvas = canvas;
    }

    display(){
        this.canvas.rect(this.x, this.y, this.width, this.height);
    }
}

class Base{
    constructor(canvas, x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.canvas = canvas;
    }

    display(){
        this.canvas.rect(this.x, this.y, this.width, this.height);
    }
}