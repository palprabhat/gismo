/**
 * argMax function from https://gist.github.com/engelen/fbce4476c9e68c52ff7e5c2da5c24a28
 * Retrieve the array key corresponding to the largest element in the array.
 *
 * @param {Array.<number>} array Input array
 * @return {number} Index of array element with largest value
 */

class NeuralNetwork {
    constructor(no_of_inputs, hidden_neurons, no_of_layers, no_of_outputs, learning_rate) {
        this.no_of_inputs = no_of_inputs;
        this.hidden_neurons = hidden_neurons;
        this.no_of_layers = no_of_layers;
        this.no_of_outputs = no_of_outputs;
        this.learning_rate = learning_rate;

        this.weights = [];
        this.bias = [];
        this.weights[0] = new Matrix(this.hidden_neurons, this.no_of_inputs);
        this.bias[0] = new Matrix(this.hidden_neurons, 1);
        for (let i = 1; i < no_of_layers; i++) {
            this.weights[i] = new Matrix(this.hidden_neurons, this.hidden_neurons);
            this.bias[i] = new Matrix(this.hidden_neurons, 1);
        }
        this.weights[this.no_of_layers] = new Matrix(this.no_of_outputs, this.hidden_neurons);
        this.bias[this.no_of_layers] = new Matrix(this.no_of_outputs, 1);

        this.__initialWeights();
    }

    argMax(array) {
        return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
    }

    __relu(val) {
        return Math.max(0, val);
    }

    __sigmoid(val) {
        return 1 / (Math.exp(-val) + 1);
    }

    __sigmoidDerivative(x) {
        return x * (1 - x);
    }

    __mutate(x, learning_rate) {
        if (Math.random() < learning_rate) {
            // var offset = randomGaussian() * 0.5;
            
            var offset = Math.floor(Math.random() * 2) - 0.5;
            x += offset;
            return x;
        } else {
            return x;
        }
    }

    __feedForward(input) {

        if (input instanceof Array) {
            input = Matrix.toMatrix(input);
        } else if (input instanceof Matrix) {
            input = input;
        } else {
            console.error("input must be an Array or a column Matrix");
            return undefined;
        }

        this.hidden = [];
        this.hidden[0] = Matrix.multiply(this.weights[0], input);
        this.hidden[0].add(this.bias[0]);
        this.hidden[0].map(this.__sigmoid); //activation function

        for (let i = 1; i < this.no_of_layers; i++) {
            this.hidden[i] = Matrix.multiply(this.weights[i], this.hidden[i - 1]);
            this.hidden[i].add(this.bias[i]);
            this.hidden[i].map(this.__sigmoid); //activation function
        }

        this.hidden[this.no_of_layers] = Matrix.multiply(this.weights[this.no_of_layers], this.hidden[this.no_of_layers - 1]);
        this.hidden[this.no_of_layers].add(this.bias[this.no_of_layers]);
        this.hidden[this.no_of_layers].map(this.__sigmoid); //activation function

        return Matrix.toArray(this.hidden[this.no_of_layers]);
    }

    __initialWeights() {
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i].randomize();
            this.bias[i].randomize();
        }
    }

    __error(predicted_output, actual_output) {
        predicted_output.multiply(-1);
        let error = [];

        for (let i = 0; i <= this.no_of_layers; i++) {
            error[i] = [];
        }

        error[this.no_of_layers] = Matrix.add(actual_output, predicted_output);
        let weightTranspose;
        for (let i = this.no_of_layers - 1; i >= 0; i--) {
            weightTranspose = Matrix.transpose(this.weights[i + 1]);
            error[i] = Matrix.multiply(weightTranspose, error[i + 1]);
        }
        return error;
    }

    __calculateCost(error) {
        let sqSum = 0;
        for (let i = 0; i < error.length; i++) {
            sqSum += Math.pow(error[i], 2);
        }

        let meanSqError = sqSum / error.length;

        return meanSqError;
    }

    __getGradient() {
        let gradient = [];
        for (let i = 0; i <= this.no_of_layers; i++) {
            gradient[i] = Matrix.map(this.hidden[i], this.__sigmoidDerivative);
        }

        return gradient;
    }

    predict(input) {
        let output = this.__feedForward(input);
        return output;
    }

    train(train_input, train_output) {
        if (train_input instanceof Array && train_output instanceof Array) {
            this.train_input = Matrix.toMatrix(train_input);
            this.train_output = Matrix.toMatrix(train_output);
        } else if (train_input instanceof Matrix && train_output instanceof Matrix) {
            this.train_input = train_input;
            this.train_output = train_output;
        } else {
            console.error("train_input and train_output must be Arrays or column Matrices");
            return undefined;
        }
        let output = this.__feedForward(this.train_input);
        let error = this.__error(Matrix.toMatrix(output), this.train_output);
        this.mse = this.__calculateCost(Matrix.toArray(error[this.no_of_layers]));

        //deltaW = lr*E*gradient*input
        let gradient = this.__getGradient();

        gradient[0].multiply(error[0]);
        gradient[0].multiply(this.learning_rate);

        let inputTranspose = Matrix.transpose(this.train_input);
        let deltaWeight = Matrix.multiply(gradient[0], inputTranspose);
        this.weights[0].add(deltaWeight);

        this.bias[0].add(gradient[0]);

        for (let i = 1; i <= this.no_of_layers; i++) {
            gradient[i].multiply(error[i]);
            gradient[i].multiply(this.learning_rate);

            inputTranspose = Matrix.transpose(this.hidden[i - 1]);
            deltaWeight = Matrix.multiply(gradient[i], inputTranspose);
            this.weights[i].add(deltaWeight);

            this.bias[i].add(gradient[i]);
        }
    }

    mutate() {
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i].map(this.__mutate, this.learning_rate);
            this.bias[i].map(this.__mutate, this.learning_rate);
        }
    }

    copy() {
        var dupNN = new NeuralNetwork(this.no_of_inputs, this.hidden_neurons, this.no_of_layers, this.no_of_outputs, this.learning_rate);
        for (let i = 0; i < this.weights.length; i++) {
            dupNN.weights[i] = this.weights[i].copy();
            dupNN.bias[i] = this.bias[i].copy();
        }
        return dupNN;
    }
}