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


    const oVector = this.getOutputVector(xVector);

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

    return uVectorOutput.map((u) => AuxMath.sigmoid(u));
  }
}
