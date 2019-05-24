# Game for Intelligent Simulated Military Opponents (GISMO)

GISMO is a Game for Intelligent Simulated Military Opponents which simulates a battlefield in which two rival forces compete to win. This is much like a real-world military battle scenario, which has been conceived in the form of a game to make it an interesting problem to solve. The goal of this project is to play the game using an architecture which uses Neural Networks along with the traditional Genetic Algorithm.

## The Game

![game](https://github.com/sahiljohari/gismo/blob/master/gismo.jpg)

The game is a simple battlefield simulation. In any conflict, each competitor will have a Base, and will control four tanks. Battlefield will have plain terrain to facilitate tank movement and mountains as obstacles. Each entity in the game (except obstacles) will have a health associated with them. Each competitor will have details on the location of their base and position of the tanks. **The objective of the game is to locate and destroy the enemy base.**

There are two ways to end the game:
- One competitor destroys the opponent’s base.
- One competitor destroys all opposing tanks.

There can be two cases for a draw:
- When all the tanks are destroyed, and both the bases have equal health.
- When both the bases are destroyed.
Apart from the above cases, there can be another situation when all the tanks of both the competitors are destroyed. In this scenario, the base with greater health will win the game.

## Architecture
Each tank has two neural networks associated with it. These networks facilitate predicting the movement and rotation of their turret. Programmatically, this is done using the TensorFlow.js library which is a JavaScript library for training and deploying machine learning models in the browser. We will denote these networks as **Movement network and Turret network**. Structurally, these two networks are exactly same, except for the output layer which differs in the number of output nodes.

### Movement Network
The movement network is a simple 2-layer neural network which takes a 17 x 1 vector as input. The input vector contains different values which are the identified parameters for a tank to be aware of its surroundings. These parameters are defined as follows:

- Pixel distance from the mountains (input neurons 1-8)
- Whether or not the tank sees its friendly tanks (input neurons 9-11)
- Whether or not the tank sees its own blockhouse/base (input neuron 12)
- Whether or not the tank sees its opponent tanks (input neurons 13-16)
- Whether or not the tank sees its opponent blockhouse/base (input neurons 17)

It must be noted that, apart from the first 8 neurons (distance), all the parameters are in the form of 0s and 1s indicating False and True respectively. Using these parameters, the neural network makes a binary
prediction of whether to move or not using a threshold value of 0.5 to decide the outcome. This facilitates a 50% probability for each action in the output of the network. The direction of movement is managed by the turret.

### Turret Network
Each tank has a turret attached to it which provides vision and firing capability to it. In order to move the turret in the right direction for detection of adversarial tank and combating, a 2-layer neural network identical to the movement network has been designed which takes the same inputs listed above and predicts the movement direction of the turret – Clockwise, No movement, Counter-clockwise.

### Genetic Algorithm
The implementation of genetic algorithm begins by generating a population pool of 100 tanks for each team and deploy them to play in batches of 4 per team. Each iteration, also called a generation, consists of 25 gameplays which are played by these tanks. Once a generation terminates, the fitness of each tank is calculated for both the teams. The fitness function is defined by two quantities:

- Closest distance a tank ends up at from the opponent blockhouse
- Whether or not a tank has run into a mountain

To reinforce the fitness function, a tank is penalized by 90% when it hits a mountain during its course of gameplay. 

The next step is to place the tanks which played in the recent generation into a mating pool. This is like a collection of tanks which will be used to create a new generation of tanks based on their fitness. The tanks with higher fitness have a higher chance of being placed into the mating pool. For example, a tank with fitness of 50 will be placed into the mating pool 50 times. By doing this, the chances of being picked for the next generation is influenced by the fitness of a tank.

From the mating pool, a set of 100 tanks per team are generated for the next generation. This is done by picking two tanks randomly (called selection) and performing a crossover of them i.e. taking 50% of the neural network weights from one tank and combining it with 50% of the weights of another tank. Crossover is done 100 times to generate that many new tanks for the next generation. These crossed over neural network weights are also mutated by 1% - which means changing 10% of the weights slightly in a random manner.

At the end of this process, there are 100 tanks per team with modified set of weights which play the game for another 25 gameplay cycles. The process of genetically modifying these tanks continues until the game can run. After a certain number of generations, the tanks appear to converge to their goal (opponent blockhouse) and destroy it.

## Results
After running the game for several times, the following observations were captured:

- At generation 1, tanks from both the teams showed random behavior and did not achieve any significant progress.
- By generation 5, it was observed that both red and blue tanks began figuring out their enemy blockhouse location and majority of the tanks started converging toward their opponent’s base.
- By generation 25, all the tanks started moving toward their opponent’s base and killed their adversaries whenever encountered.

As the game progressed, it was clear that the tanks were learning to play intelligently and were competing to achieve victory.

## Contributors
- Sahil Johari
- Prabhat Pal
- Palash Khandekar
