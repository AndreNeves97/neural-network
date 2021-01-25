import { DataSample } from "./data-sample.model";
import { RNA } from "./rna.interface";

export class RNATrainerService {
  constructor(
    public times: number,
    public data: DataSample[],
    public rna: RNA
  ) {}

  train() {
    console.log("Época \t|\t Erro de aproximação \t|\t Erro de classificação ");
    console.log("----- \t|\t ------------------- \t|\t ----------------------");
    console.log("      \t|\t                     \t|\t                       ");

    for (let e = 0; e < this.times; e++) {
      this.trainEra(e);
    }
  }

  trainEra(era_number: number) {
    let error_approx_era: number = 0;
    let error_classification_era: number = 0;

    for (let a = 0; a < this.data.length; a++) {
      const sample: DataSample = this.data[a];

      const x_vector: number[] = sample.in;
      const y_vector: number[] = sample.out;

      const o_vector: number[] = this.rna.train(x_vector, y_vector);

      const error_approx = this.getErrorApprox(y_vector, o_vector);
      const error_classification = this.getErrorClassification(
        y_vector,
        o_vector
      );

      error_approx_era += error_approx;
      error_classification_era += error_classification;
    }

    console.log(
      `${era_number} \t|\t ${error_approx_era} \t|\t ${error_classification_era} `
    );
  }

  getErrorApprox(y_vector, o_vector) {
    return y_vector
      .map((y, i) => Math.abs(y - o_vector[i]))
      .reduce((sum, error) => sum + error);
  }

  getErrorClassification(y_vector, o_vector) {
    const sum_threshold_error = o_vector
      .map(this.getThresholdValue)
      .map((ot, i) => Math.abs(y_vector[i] - ot))
      .reduce((sum, error) => sum + error);

    if (sum_threshold_error > 0) {
      return 1;
    }

    return 0;
  }

  getThresholdValue(o) {
    return o < 0.5 ? 0 : 1;
  }
}
