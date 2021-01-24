import { RNA } from "../rna.interface";

export class MLP implements RNA {
  weights: number[][];

  constructor(public qtd_in: number, public qtd_out: number) {
  }

  get ni() {
    return 0.001;
  }

  train(x: number[], y: number[]): number[] {
    throw new Error("Method not implemented.");
  }
}
