export interface RNA {
  getOutput(x: number[]): number[];
  train(x: number[], y: number[]): number[];
}
