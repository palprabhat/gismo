class NeuralNetworkTF {
  constructor(
    inputShape,
    hidden_neurons,
    num_layers,
    num_outputs,
    learning_rate
  ) {
    this.inputShape = inputShape;
    this.hidden_neurons = hidden_neurons;
    this.no_of_layers = num_layers;
    this.no_of_outputs = num_outputs;
    this.learning_rate = learning_rate;

    this.model = tf.sequential();

    // first hidden layer
    this.model.add(
      tf.layers.dense({
        units: this.hidden_neurons,
        inputShape: this.inputShape,
        activation: "relu"
      })
    );

    this.model.add(
      tf.layers.dense({
        units: this.hidden_neurons,
        inputShape: [this.inputShape[0], this.hidden_neurons],
        activation: "relu"
      })
    );

    // flatten
    this.model.add(tf.layers.flatten());
    // TO-DO: capture number of neurons from this step
    // and add a dense layer to squeeze it up

    // output layer
    this.model.add(
      tf.layers.dense({
        units: this.no_of_outputs,
        activation: this.no_of_outputs > 1 ? "softmax" : "sigmoid"
      })
    );

    this.model.compile({
      optimizer: tf.train.sgd(this.learning_rate),
      loss: "meanSquaredError"
    });
  }

  showModel() {
    this.model.summary();
  }

  predict(X_train) {
    // model.summary();
    const yhat = this.model.predict(tf.tensor(X_train));
    const arr = Array.from(yhat.dataSync());
    yhat.dispose();
    return arr.indexOf(Math.max(...arr));
  }

  // Returns a collection of TypedArrays of weights of type float
  getWeights() {
    let weightsCollection = [];
    let weights = this.model.getWeights();
    for (let i = 0; i < weights.length; i++) {
      weightsCollection.push(weights[i].dataSync());
    }
    return weightsCollection;
  }

  setWeights() {
    // You can access a model's layer by using model.layers.
    // You can set a layer's weights with layer.setWeights().
    // Therefore you can use code like the following to set the weights of a single layer: model.layers[2].setWeights(...).
    // You still can't set individual weights. But at least this helps you narrow down to a smaller set of weights.
  }
}
