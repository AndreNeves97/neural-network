import { MultiplyMatrices } from "./multiply-matrices";

export class AuxMath {
  static multiplyVectorAndMatrix(a, b) {
    return MultiplyMatrices.multiplyVectorAndMatrix(a, b);
  }

  static sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
}
