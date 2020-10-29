import { Random } from "../random";

export type PerceptronDataSample = {in: number[], out: number[]}

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
    return Array.from(
      {length: qtd_in + 1}, 
      () => this.generateWeightsVector(qtd_out)
    );
  }

  generateWeightsVector(length: number) {
    return Array.from(
      {length},
      () => Random.getDouble(-0.3, 0.3)
    )
  }

  train(x: number[], y: number[]): number[] {
    const input = [1, ...x];
    const output = [...y];

    const u = this.getAllInputSum(input, output.length, this.weights);
    
    const o = u.map(
      value => this.activationFunction(value)
    );

    const deltas = input.map(
      x => this.getInputDeltas(output, o, x)
    );

    this.weights = this.getNewWeights(this.weights, deltas);

    return o;
  }

  getAllInputSum(input, output_count, weights) {
    return Array.from(
      {length: output_count},
      (_, i) => {
        const neuron_weights = weights.map(weight_vector => weight_vector[i]);
        return this.getNeuronInputSum(input, neuron_weights);
      }
    );
  }

  getNeuronInputSum(input, neuron_weights: number[]) {
    return neuron_weights.reduce(
      (acc, weight, i) => acc + weight * input[i]
    );
  }

  activationFunction(u) {
    return 1 / (1 + Math.exp(-u));
  }


  getInputDeltas(output_vector, o_vector, x): number[] {
    return o_vector.map(
      (o, i) => this.ni * (output_vector[i] - o) * x
    );
  }

  getNewWeights(weights, deltas): number[][] {
    return weights.map(
      (neurons_weights, input_index) => this.getNewNeuronsWeights(deltas, neurons_weights, input_index)
    );
  }

  getNewNeuronsWeights(deltas, neurons_weights, input_index) {
    return neurons_weights.map(
      (current_weight, neuron_index) => current_weight + deltas[input_index][neuron_index]
    )
  }
}