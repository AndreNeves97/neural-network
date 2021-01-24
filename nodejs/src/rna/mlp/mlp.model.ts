import { Random } from "../../random";
import { RNA } from "../rna.interface";

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

  get ni() {
    return 0.3;
  }

  train(x: number[], y: number[]): number[] {
    throw new Error("Method not implemented.");
  }
}
