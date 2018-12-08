class DNA {
  constructor(canvas, newgenes, lifetime=500) {
    this.maxforce = 0.1;
    this.canvas = canvas;

    if (newgenes) {
      this.genes = newgenes;
    } else {
      this.genes = [];

      for (let i = 0; i < lifetime; i++) {
        let angle =  __getRandomIntInclusive(0, 360);
        this.genes[i] = this.canvas.createVector(Math.cos(angle), this.canvas.sin(angle));
        this.genes[i].mult(0.1);
      }
    }
    this.genes[0].normalize();
  }

  crossover(partner) {
    let child = new Array(this.genes.length);

    let crossover = this.canvas.int(Math.random(this.genes.length));
    for (let i = 0; i < this.genes.length; i++) {
      if (i > crossover) child[i] = this.genes[i];
      else child[i] = partner.genes[i];
    }
    let newgenes = new DNA(this.canvas, child);
    return newgenes;
  }

  mutate(m) {
    for (let i = 0; i < this.genes.length; i++) {
      if (Math.random(1) < m) {
        let angle =  __getRandomIntInclusive(0, 8) * 45;
        this.genes[i] = this.canvas.createVector(Math.cos(angle), this.canvas.sin(angle));
        this.genes[i].mult(Math.random(0, this.maxforce));
        if (i == 0) this.genes[i].normalize();
      }
    }
  }
}

function __getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}