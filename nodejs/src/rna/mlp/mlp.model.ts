import { Random } from "../../utils/random";
import { RNA } from "../rna.interface";
import { AuxMath } from "../../utils/math/aux-math";

export class MLP implements RNA {
  wHidden: number[][];
  wOutput: number[][];

  constructor(public qtdIn: number, public qtdH, public qtdOut: number) {
    this.wHidden = this.generateWeightsMatrix(qtdIn, qtdH);
    this.wOutput = this.generateWeightsMatrix(qtdH, qtdOut);
  }

  get ni() {
    return 0.001;
  }

  generateWeightsMatrix(qtdIn: number, qtdOut: number): number[][] {
    return Array.from({ length: qtdIn + 1 }, () =>
      this.generateWeightsVector(qtdOut)
    );
  }

  generateWeightsVector(length: number) {
    return Array.from({ length }, () => Random.getDouble(-0.3, 0.3));
  }

  train(x: number[], y: number[]): number[] {
    const xVector = [...x, 1];
    const yVector = [...y];

    const { hVector, oVector } = this.getOutputVector(xVector);

    const deltasWOutput = this.getOutputDeltas(yVector, oVector);
    const deltasWHidden = this.getHiddenLayerDeltas(deltasWOutput, hVector);

    this.wHidden = this.getNewWeights(this.wHidden, deltasWHidden, xVector);
    this.wOutput = this.getNewWeights(this.wOutput, deltasWOutput, hVector);

    return oVector;
  }

  getOutputVector(xVector: number[]) {
    const uVectorHidden = AuxMath.multiplyVectorAndMatrix(
      xVector,
      this.wHidden
    );

    const hVector = [...uVectorHidden.map((u) => AuxMath.sigmoid(u)), 1];

    const uVectorOutput = AuxMath.multiplyVectorAndMatrix(
      hVector,
      this.wOutput
    );

    const oVector = uVectorOutput.map((u) => AuxMath.sigmoid(u));

    return { hVector, oVector };
  }

  getOutputDeltas(yVector, oVector): number[] {
    return oVector.map((o, i) => o * (1 - o) * (yVector[i] - o));
  }

  getHiddenLayerDeltas(deltasWOutput, hVector): number[] {
    return hVector.map((h, i) => {
      const deltaOutputSum = deltasWOutput.reduce(
        (sum, deltaOutput, output_index) =>
          sum + deltaOutput * this.wOutput[i][output_index],
        0
      );

      return h * (1 - h) * 1 + deltaOutputSum;
    });
  }

  getNewWeights(
    weights: number[][],
    deltas: number[],
    inputs: number[]
  ): number[][] {
    return weights.map((input_weight_vector, input_index) => {
      const input_value = inputs[input_index];

      return this.getNewOutputsWeights(
        deltas,
        input_weight_vector,
        input_value
      );
    });
  }

  getNewOutputsWeights(deltas: number[], input_weight_vector, input_value) {
    return input_weight_vector.map(
      (current_weight, output_index) =>
        current_weight + this.ni * deltas[output_index] * input_value
    );
  }
}
