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


    

    collide(obstacles){
        let hit = false;
        obstacles.forEach(function(obstacles) {
            hit = collidePointRect(this.pos.x,this.pos.y,obstacles.x,obstacles.y,obstacles.width,
                    obstacles.height);
        },this)
          

        return hit;
    }
}
