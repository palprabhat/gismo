class NeuralNetworkTF {
  constructor(
    num_inputs,
    hidden_neurons,
    num_layers,
    num_outputs,
    learning_rate
  ) {
    this.no_of_inputs = num_inputs;
    this.hidden_neurons = hidden_neurons;
    this.no_of_layers = num_layers;
    this.no_of_outputs = num_outputs;
    this.learning_rate = learning_rate;
  }

  __build_model() {
    const model = tf.sequential();

    // first hidden layer
    model.add(
      tf.layers.dense({
        units: this.hidden_neurons,
        inputShape: [this.no_of_inputs],
        activation: "relu"
      })
    );

    for (let idx = 0; idx < this.no_of_layers; idx++) {
      // subsequent hidden layers
      model.add(
        tf.layers.dense({
          units: this.hidden_neurons,
          inputShape: [this.hidden_neurons],
          activation: "relu"
        })
      );
    }

    // output layer
    model.add(
      tf.layers.dense({
        units: this.no_of_outputs,
        activation: "relu"
      })
    );

    const optSgd = tf.train.sgd(0.1);
    model.compile({
      optimizer: tf.train.sgd(this.learning_rate),
      loss: "meanSquaredError"
    });

    return model;
  }

  async __train(X_train, y_train) {
    const model = this.__build_model();
    for (let i = 0; i < 10; i++) {
      const config = {
        shuffle: true,
        epochs: 10
      };
      const response = await model.fit(tf.tensor2d(X_train), tf.tensor2d(y_train), config);
      // console.log(response.history.loss[0]);
    }
  }

  // Public functions
  train(X_train, y_train) {
    this.__train(X_train, y_train).then(() => {
      console.log("training complete");
    });
  }

  predict(X_train) {
    const model = this.__build_model();
    return model.predict(tf.tensor2d(X_train)).dataSync();
  }
}
// training data
// const X = tf.tensor2d([[0.25, 0.94], [0.12, 0.3], [0.4, 0.34], [0.1, 0.41]]);

// target output
// const y = tf.tensor2d([
//   [0.3, 0.5, 0.4],
//   [0.13, 0.15, 0.24],
//   [0.33, 0.54, 0.14],
//   [0.23, 0.25, 0.42]
// ]);
