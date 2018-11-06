class Bullet {
	constructor(canvas, id, tankX, tankY, turretAngle, bulletRange){
		this.speed = 15;
		this.id = id;
		this.canvas = canvas;
		this.tankX = tankX;
		this.tankY = tankY;
		this.turretAngle = turretAngle;
		this.pos = this.canvas.createVector(this.tankX + 25*Math.cos(Math.PI*(this.turretAngle/180)), 
																				this.tankY + 25*Math.sin(Math.PI*(this.turretAngle/180)));
		this.prevPos = this.pos.copy();
		this.vel = p5.Vector.fromAngle(this.canvas.radians(this.turretAngle));
		this.vel.mult(this.speed);
		this.maxRange = bulletRange;
		this.distTravelled = 0;
	}

	update() {
		this.prevPos = this.pos.copy();
		this.pos.add(this.vel);
		this.distTravelled = this.canvas.dist(this.tankX, this.tankY, this.pos.x, this.pos.y);
	}
		
	display() {
		this.canvas.push();
		this.canvas.stroke(0,0,0);
		this.canvas.strokeWeight(8);
		this.canvas.point(this.pos.x, this.pos.y);
		this.canvas.pop();
	}

	collide(obstacle){
		let hit = false;
		hit = this.canvas.collidePointRect(this.pos.x, this.pos.y, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
			if(hit === true){
				if (obstacle instanceof Tank) {
					if(this.distTravelled <= (this.maxRange * 0.25))
						obstacle.health -= 25;
					else if(this.distTravelled <= (this.maxRange * 0.5))
						obstacle.health -= 20;
					else if(this.distTravelled <= (this.maxRange * 0.75))
						obstacle.health -= 15;
					else
						obstacle.health -= 10;

					if(obstacle.health <= 0){
						obstacle.causeOfDeath = this;
					}
        } else if (obstacle instanceof Base) {
					if(this.distTravelled <= (this.maxRange * 0.25))
						obstacle.health -= 5;
					else if(this.distTravelled <= (this.maxRange * 0.5))
						obstacle.health -= 4;
					else if(this.distTravelled <= (this.maxRange * 0.75))
						obstacle.health -= 3;
					else
						obstacle.health -= 2;
        }
			}
			if(this.pos.x < 0 || this.pos.x > this.canvas.width || this.pos.y < 0 || this.pos.y > this.canvas.height) {
				hit = true; 
			}
		return hit;
	}
}
