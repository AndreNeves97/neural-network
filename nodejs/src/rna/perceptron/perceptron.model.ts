import { Random } from "../../random";

export class Perceptron {
  qtd_in: number;
  qtd_out: number;
  ni: number;

  weights: number[][];

  constructor(qtd_in: number, qtd_out: number, ni: number) {
    this.qtd_in = qtd_in;
    this.qtd_out = qtd_out;
    this.ni = ni;

    this.weights = this.generateWeightsMatrix(qtd_in, qtd_out);
  }

  generateWeightsMatrix(qtd_in: number, qtd_out: number): number[][] {
    return Array.from({ length: qtd_in + 1 }, () =>
      this.generateWeightsVector(qtd_out)
    );
  }

  generateWeightsVector(length: number) {
    return Array.from({ length }, () => Random.getDouble(-0.3, 0.3));
  }

  train(x: number[], y: number[]): number[] {
    const x_vector = [1, ...x];
    const y_vector = [...y];

    const u_vector = this.getAllInputSum(
      x_vector,
      y_vector.length,
      this.weights
    );

    const o_vector = u_vector.map((u) => this.activationFunction(u));

    const deltas: number[][] = x_vector.map((x) =>
      this.getWeightDeltas(y_vector, o_vector, x)
    );

    this.weights = this.getNewWeights(this.weights, deltas);

    return o_vector;
  }

  getAllInputSum(x_vector, output_count, weights) {
    return Array.from({ length: output_count }, (_, output_index) => {
      const output_neuron_weights = weights.map(
        (input_weight_vector) => input_weight_vector[output_index]
      );

      return this.getNeuronInputSum(x_vector, output_neuron_weights);
    });
  }

  getNeuronInputSum(x_vector, neuron_weights: number[]) {
    return neuron_weights.reduce(
      (sum, weight, i) => sum + weight * x_vector[i]
    );
  }

  activationFunction(u) {
    return 1 / (1 + Math.exp(-u));
  }

  getWeightDeltas(y_vector, o_vector, x): number[] {
    return o_vector.map((o, i) => this.ni * (y_vector[i] - o) * x);
  }

  getNewWeights(weights: number[][], deltas: number[][]): number[][] {
    return weights.map((input_weight_vector, input_index) =>
      this.getNewOutputsWeights(deltas, input_weight_vector, input_index)
    );
  }

  getNewOutputsWeights(deltas, input_weight_vector, input_index) {
    return input_weight_vector.map(
      (current_weight, output_index) =>
        current_weight + deltas[input_index][output_index]
    );
  }
}
