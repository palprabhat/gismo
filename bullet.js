class Bullet {
    constructor(canvas, x1, y1, x2, y2){
        this.canvas = canvas;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }

    display(){
        this.canvas.line(x1, y1, x2, y2);
    }

    collide(obstacle){
        let hit = false;
        switch(obstacle.constructor.name){
        case 'Tank':
        case 'Base':
        case 'Mountain':
            hit = this.canvas.collideLineRect(this.x1, this.y1, this.x2, this.y2,
                                                obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            break;

        case 'Bullet':
            hit = this.canvas.collideLineLine(this.x1, this.y1, this.x2, this.y2,
                                            obstacle.x1, obstacle.y1, obstacle.x2, obstacle.y2);
            break;

        default:
            console.log('Bullet class collision malfunction!..');
        }
        return hit;
    }
}