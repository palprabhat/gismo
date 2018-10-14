function evolve(population) {
    calculateFitness(population);
    naturalSelection(population);
}

function calculateFitness(population) {
    var totalScore = 0;
    for (var i = 0; i < population.length; i++) {
        totalScore += population[i].score;
    }

    for (var i = 0; i < population.length; i++) {
        population[i].fitness = population[i].score - population[i].posWrtPillar;
    }
}

function calculateFitnessMovement(population){
    
}

function naturalSelection(population) {
    var bestFitness = population[0].fitness;
    var bestBrain = population[0].brain.copy();
    for (var i = 1; i < population.length; i++) {
        if (bestFitness < population[i].fitness) {
            bestFitness = population[i].fitness;
            bestBrain = population[i].brain.copy();
        }
    }

    for (var i = 0; i < Math.floor(population.length / 5); i++) {
        balls[i] = createBall();
    }
    for (var i = Math.floor(population.length / 5); i < population.length; i++) {
        balls[i] = createBall(bestBrain.copy());
        if (Math.random() < 0.8) {
            balls[i].brain.mutate();
        }
    }
}