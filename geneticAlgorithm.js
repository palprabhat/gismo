function evolve(population, bases, canvas) {
	calculateFitnesses(population, bases, canvas);
	naturalSelection(population, bases);
}

function calculateFitnesses(population, bases, canvas) {
	calculateFitnessMovement(population, bases, canvas);
	// console.log('population :', population);
}

function calculateFitnessMovement(population, bases, canvas){
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

function naturalSelection(population) {
	let bestMovement = population[0].movementFitness;
	let bestMovementNetwork = population[0].movementNetwork.copy();
	for (let i = 1; i < population.length; i++) {
		if (bestMovement < population[i].movementFitness) {
			bestMovement = population[i].movementFitness;
			bestMovementNetwork = population[i].movementNetwork.copy();
		}
	}

	console.log('bestMovementNetwork :', bestMovementNetwork);
	// for (let i = 0; i < Math.floor(population.length / 5); i++) {
	// 	balls[i] = createBall();
	// }
	// for (let i = Math.floor(population.length / 5); i < population.length; i++) {
	// 	balls[i] = createBall(bestBrain.copy());
	// 	if (Math.random() < 0.8) {
	// 		balls[i].brain.mutate();
	// 	}
	// }
}