function evolve(population, bases, canvas) {
	let redPopulation = population.filter(p => p.id === 0);
	let bluePopulation = population.filter(p => p.id === 1);

	calculateFitnesses(redPopulation, bases, canvas);
	calculateFitnesses(bluePopulation, bases, canvas);
	naturalSelection(redPopulation, 0);
	naturalSelection(bluePopulation), 1;
}

function calculateFitnesses(population, bases, canvas) {
	calculateFitnessMovement(population, bases, canvas);
	// console.log('population :', population);
}

function calculateFitnessMovement(population, bases, canvas) {
	for(let tank of population){
		let distance = 0;
		if(tank.id === 0){
			distance = canvas.dist(bases[1].x, bases[1].y, tank.x, tank.y);
		} 
		else{
			distance = canvas.dist(bases[0].x, bases[0].y, tank.x, tank.y);
		}

		tank.movementFitness = Math.pow(distance, 2);
	}
}

function naturalSelection(population, tankId) {
	let bestMovement = population[0].movementFitness;
	let bestMovementTank = population[0];

	for (let i = 1; i < population.length; i++) {
		if (bestMovement < population[i].movementFitness) {
			bestMovement = population[i].movementFitness;
			bestMovementTank = population[i];
		}
	}

	if (tankId === 0){
		for (let i = 0; i < Math.floor(population.length / 5); i++) {
			nnMovementPoolRed[i] = new _NeuralNetwork(121 * 7, 16, 1, 0.1);
			nnTurretPoolRed[i] = new _NeuralNetwork(121 * 7, 16, 3, 0.1);
		}

		for (let i = Math.floor(population.length / 5); i < population.length; i++) {
			if (Math.random() < 0.8) {
				bestMovementTank.mutate();
			}
			nnMovementPoolRed[i] = bestMovementTank.movementNetwork.clone();
			nnTurretPoolRed[i] = bestMovementTank.turretNetwork.clone();
		}
	}
	else {
		for (let i = 0; i < Math.floor(population.length / 5); i++) {
			nnMovementPoolBlue[i] = new _NeuralNetwork(121 * 7, 16, 1, 0.1);
			nnTurretPoolBlue[i] = new _NeuralNetwork(121 * 7, 16, 3, 0.1);
		}

		for (let i = Math.floor(population.length / 5); i < population.length; i++) {
			if (Math.random() < 0.8) {
				bestMovementTank.mutate();
			}
			nnMovementPoolBlue[i] = bestMovementTank.movementNetwork.clone();
			nnTurretPoolBlue[i] = bestMovementTank.turretNetwork.clone();
		}
	}
}