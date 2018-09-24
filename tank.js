class Tank{
    constructor(canvas, x, y, width){
        this.x = x;
        this.y = y;
        this.width = width;
        this.canvas = canvas;
        this.viewAngle = 0;
        this.movementNetwork = new NeuralNetwork(2, 6, 2, 4, 0.1);
        this.turretNetwork = new NeuralNetwork(2, 6, 2, 1, 0.1);
        this.bullets = [];
        for (let i = 0; i < 150; i++){
            this.bullets.push(new Bullet(canvas));
        }
    }

    display(){
        this.canvas.push();
        this.canvas.translate(this.x, this.y);
        this.__rotateTurret(this.viewAngle);
        this.canvas.rect(0, 0, this.width, this.width);
        this.canvas.pop();
    }

    train(){
        this.movementNetwork.train([Math.random(), Math.random()], [Math.random(), Math.random(), Math.random(), Math.random()]);
        this.turretNetwork.train([Math.random(), Math.random()], [Math.random()]);
    }

    move(){
        let move  = this.movementNetwork.argMax(this.movementNetwork.predict([this.x, this.y]));

        switch (move) {
            case 0:
                this.x -= 1;
                break;
            case 1:
                this.x += 1;
                break;
            case 2:
                this.y -= 1;
                break;
            case 3:
                this.y += 1;
                break;
        }
    }

    moveTurret(){
        let turretMovement = this.turretNetwork.predict([this.x, this.y])

        if (turretMovement > 0.5){
            this.viewAngle -= 45;
        }
        else{
            this.viewAngle += 45;
        }
    }

    collide(obstacle) {
        let hit = false;
        switch(obstacle.constructor.name){
            case 'Base':
            case 'Tank':
            case 'Mountain':
                hit = this.canvas.collideRectRect(this.x, this.y, this.width, this.width,
                                            obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                break;
            
            default:
                console.log('Tank class collision malfunction!..');
        }
        return hit;
    }

    __rotateTurret(viewAngle){
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