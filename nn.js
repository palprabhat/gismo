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

  __getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Returns a collection of TypedArrays of weights of type float
  __getWeights() {
    // return weights[layerIdx].dataSync();
    return this.model.getWeights();
  }

  __setWeights() {
    // You can access a model's layer by using model.layers.
    // You can set a layer's weights with layer.setWeights().
    // Therefore you can use code like the following to set the weights of a single layer: model.layers[2].setWeights(...).
    // You still can't set individual weights. But at least this helps you narrow down to a smaller set of weights.
  }

  showModel() {
    this.model.summary();
  }

  predict(X_train) {
    const yhat = this.model.predict(tf.tensor(X_train));
    const arr = Array.from(yhat.dataSync());
    yhat.dispose();
    return arr.indexOf(Math.max(...arr));
  }

  getCopy() {
    return this.copy();
  }

  mutate() {
    // let weightsCollection = this.model.getWeights();
    // for (let i = 0; i < weightsCollection.length; i++) {
    //   for (let j = 0; j < weightsCollection[i].dataSync().length; j++) {
    //     if (this.__getRandomIntInclusive(0, 100) <= this.learning_rate * 100) {
    //       let offset = Math.floor(Math.random() * 2) - 0.5;
    //       console.log(weightsCollection.dataSync());
    //       weightsCollection[i].dataSync()[j] += offset;
    //     }
    //   }
    //   // console.log(weightsCollection[i].dataSync());
    //   // this.model.layers[i].setWeights(weightsCollection[i]);
    // }
  }
}
