let sigmoid = (x) => 1 / (1 + Math.exp(-x));

let dsigmoid = (x) => x * (1 - x); // x = sigmoid(y), but already "sigmoided"


class Layer {
    constructor(input_nodes, output_nodes) {
        this.input_nodes = input_nodes;
        this.output_nodes = output_nodes;

        this.weights = Matrix.random(this.output_nodes, this.input_nodes);
        this.bias = Matrix.random(this.output_nodes, 1);

        this.mutate_rate = 0.25;
    }

    copy() {
        let result = new Layer(this.input_nodes, this.output_nodes);

        result.weights = Matrix.add(this.weights, Matrix.multiply(Matrix.random(this.output_nodes, this.input_nodes), this.mutate_rate))
        result.bias = Matrix.add(this.bias, Matrix.multiply(Matrix.random(this.output_nodes, 1), this.mutate_rate))

        return result;
    }

    feedForward(input_array) {
        let inputs = input_array;

        if(!input_array instanceof Matrix) {
            let inputs = Matrix.fromArray(input_array);
        }

        let matrix = Matrix.multiply(this.weights, inputs);
        matrix = Matrix.add(matrix, this.bias);
        matrix.map(sigmoid);

        return matrix
    }
}

class NN {
    constructor(layers) {
        this.layers = layers;
    }

    copy() {
        return new NN(this.layers.map(x => x.copy()));
    }

    predict(input_array) {
        let result = Matrix.fromArray(input_array);

        this.layers.forEach(layer => {
            result = layer.feedForward(result);
        });

        return result.toArray();
    }

    getVisualisationData() {
        let result = new Array();

        this.layers.forEach(layer => {
            result.push(layer.weights.matrix);
        })

        return result;
    }
}
