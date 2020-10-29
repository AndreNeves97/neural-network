import { Random } from "../random";

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

  generateWeightsMatrix(qtd_in: number, qtd_out: number) {
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
    const output = [...y]


    const u = output.map(
      (y, index_neuron) => this.weights.reduce(
        (acc, weight_vector, input_index) => acc + input[input_index] * weight_vector[index_neuron],
        0
      )
    );

    const o = u.map(
      u => 1 / (1 + Math.exp(-u))
    );

    const deltas = input.map(
      x => o.map(
        (o, index_neuron) => this.ni * (output[index_neuron] - o) * x
      )
    );
    

    console.log(u, o, deltas)

    this.weights = this.weights.map(
      (input_vector, input_index) => input_vector.map(
        (current_weight, output_index) => current_weight + deltas[input_index][output_index]
      )
    );

    return o;
  }
}

export type PerceptronDataSample = {in: number[], out: number[]}