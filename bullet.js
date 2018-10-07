class Bullet {
    constructor(canvas, tankX,tankY, viewAngle){
        this.speed = 10;
        this.canvas = canvas;
        this.tankX = tankX;
        this.tankY = tankY;
        this.viewAngle = viewAngle;
        this.pos = this.canvas.createVector(this.tankX + 25*Math.cos(Math.PI*(this.viewAngle/180)), 
                                            this.tankY + 25*Math.sin(Math.PI*(this.viewAngle/180)));
        this.prevPos = this.pos.copy();
        this.vel = p5.Vector.fromAngle(this.canvas.radians(this.viewAngle));
        this.vel.mult(this.speed);
        
    }
    update() {
        this.prevPos = this.pos.copy();
        this.pos.add(this.vel);
      }
      
    display() {
        this.canvas.push();
        // this.canvas.translate(0,0);
        this.canvas.stroke(0,0,0);
        this.canvas.strokeWeight(8);
        this.canvas.point(this.pos.x, this.pos.y);
        this.canvas.pop();
        
      }


    // display(){
    //     this.canvas.line(x1, y1, x2, y2);
    // }

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