let matingPool = [];

function evolve(population, bases, canvas) {
	let redPopulation = population.filter(p => p.id === 0);
	let bluePopulation = population.filter(p => p.id === 1);

	calculateFitnesses(redPopulation, bases, canvas);
	selection(redPopulation, canvas);
	reproduction(redPopulation, canvas);
	
	calculateFitnesses(bluePopulation, bases, canvas);
	selection(bluePopulation, canvas);
	reproduction(bluePopulation, canvas);
}

function calculateFitnesses(population, bases, canvas) {
	for(let tank of population){
		let distance = 0;
		if(tank.id === 0){
			distance = canvas.dist(bases[1].x, bases[1].y, tank.x, tank.y);
		} 
		else{
			distance = canvas.dist(bases[0].x, bases[0].y, tank.x, tank.y);
		}

		tank.movementFitness = distance;
		tank.movementFitness = Math.pow(tank.movementFitness, 4);
	}
}

// Generate a mating pool
function selection(population, canvas) {
	matingPool = [];

	let maxFitness = this.getMaxFitness(population);

	for (let i = 0; i < population.length; i++) {
		let fitnessNormal = canvas.map(population[i].movementFitness, 0, maxFitness, 1, 0);
		let n = canvas.int(fitnessNormal * 100); // Arbitrary multiplier
		for (let j = 0; j < n; j++) {
			matingPool.push(population[i]);
		}
	}
}

// Making the next generation
function reproduction(population, canvas) {
	for (let i = 0; i < population.length; i++) {
		let m = __getRandomIntInclusive(0, matingPool.length);
		let d = __getRandomIntInclusive(0, matingPool.length);

		let mom = matingPool[m];
		let dad = matingPool[d];

		let momgenes = mom.dna;
		let dadgenes = dad.dna;

		let child = momgenes.crossover(dadgenes);
		child.mutate(0.01);
		dnaPool[i] = child;
	}
}

function getMaxFitness(population) {
	let record = 0;
	for (let i = 0; i < population.length; i++) {
		if (population[i].movementFitness > record) {
			record = population[i].movementFitness;
		}
	}
	return record;
}

function naturalSelection(population, tankId) {
	let bestMovement = population[0].movementFitness;
	let bestMovementTank = population[0];

	for (let i = 1; i < population.length; i++) {
		if (bestMovement > population[i].movementFitness) {
			bestMovement = population[i].movementFitness;
			bestMovementTank = population[i];
		}
	}

	if (tankId === 0){
		for (let i = 0; i < Math.floor((population.length/2) / 4); i++) {
			nnMovementPoolRed[i] = new _NeuralNetwork(13, 10, 1, 0.1);
			nnTurretPoolRed[i] = new _NeuralNetwork(13, 10, 3, 0.1);
			dnaPool[i] = new DNA(canvas);
		}

		for (let i = Math.floor((population.length/2) / 4); i < (population.length/2); i++) {
			if (Math.random() < 0.4) {
				bestMovementTank.mutate();
			}
			nnMovementPoolRed[i] = bestMovementTank.movementNetwork.clone();
			nnTurretPoolRed[i] = bestMovementTank.turretNetwork.clone();
		}
	}
	else {
		for (let i = 0; i < Math.floor((population.length/2) / 4); i++) {
			nnMovementPoolBlue[i] = new _NeuralNetwork(13, 10, 1, 0.1);
			nnTurretPoolBlue[i] = new _NeuralNetwork(13, 10, 3, 0.1);
			dnaPool[i] = new DNA(canvas);
		}

		for (let i = Math.floor((population.length/2) / 4); i < (population.length/2); i++) {
			if (Math.random() < 0.4) {
				bestMovementTank.mutate();
			}
			nnMovementPoolBlue[i] = bestMovementTank.movementNetwork.clone();
			nnTurretPoolBlue[i] = bestMovementTank.turretNetwork.clone();
		}
	}
}

function __getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}