class Bullet {
	constructor(canvas, tankX,tankY, turretAngle){
		this.speed = 10;
		this.canvas = canvas;
		this.tankX = tankX;
		this.tankY = tankY;
		this.turretAngle = turretAngle;
		this.pos = this.canvas.createVector(this.tankX + 25*Math.cos(Math.PI*(this.turretAngle/180)), 
																				this.tankY + 25*Math.sin(Math.PI*(this.turretAngle/180)));
		this.prevPos = this.pos.copy();
		this.vel = p5.Vector.fromAngle(this.canvas.radians(this.turretAngle));
		this.vel.mult(this.speed);
			
	}
	update() {
		this.prevPos = this.pos.copy();
		this.pos.add(this.vel);
	}
		
	display() {
		this.canvas.push();
		this.canvas.stroke(0,0,0);
		this.canvas.strokeWeight(8);
		this.canvas.point(this.pos.x, this.pos.y);
		this.canvas.pop();
	}

	collide(obstacles){
		let hit = false;
		for(let obstacle of obstacles) {
			hit = this.canvas.collidePointRect(this.pos.x,this.pos.y,obstacle.x,obstacle.y,obstacle.width,obstacle.height);
			if(hit === true){
				if (obstacle instanceof Tank) {
					obstacle.health -= 25;
					if(obstacle.health <= 0){
						obstacle.causeOfDeath = {obstacle};
					}
        } else if (obstacle instanceof Base) {
          obstacle.health -= 5;
        }
				break;
			}
			if(this.pos.x < 0 || this.pos.x > this.canvas.width || this.pos.y < 0 || this.pos.y > this.canvas.height) {
				hit = true; 
				break;
			}
		}
		return hit;
	}
}
