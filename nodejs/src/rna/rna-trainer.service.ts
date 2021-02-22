import { DataSample } from "./data-sample.model";
import { RNA } from "./rna.interface";

export class RNATrainerService {
  constructor(
    public times: number,
    public data: DataSample[],
    public rna: RNA
  ) {}

  train() {
    this.printLogHeader();

    this.data = this.data.sort((a) => (a.onlyTestSample === false ? -1 : 1));

    for (let e = 0; e < this.times; e++) {
      this.trainEpoch(e);
    }

    console.log("\n");
  }

  trainEpoch(epoch_number: number) {
    let error_approx_epoch_test: number = 0;
    let error_classification_epoch_test: number = 0;

    let error_approx_epoch_train: number = 0;
    let error_classification_epoch_train: number = 0;

    for (let a = 0; a < this.data.length; a++) {
      const sample: DataSample = this.data[a];

      const y_vector: number[] = sample.out;
      const o_vector: number[] = this.getOutputVector(sample);

      const error_approx = this.getErrorApprox(y_vector, o_vector);
      const error_classification = this.getErrorClassification(
        y_vector,
        o_vector
      );

      if (sample.onlyTestSample) {
        error_approx_epoch_test += error_approx;
        error_classification_epoch_test += error_classification;
        continue;
      }

      error_approx_epoch_train += error_approx;
      error_classification_epoch_train += error_classification;
    }

    this.printEpochErrorLog(epoch_number, [
      error_approx_epoch_train,
      error_classification_epoch_train,
      error_approx_epoch_test,
      error_classification_epoch_test,
    ]);
  }

  printLogHeader() {
    console.log(
      "  nº   |   eAproxTrain   |   eClassTrain   |   eAproxTest    |   eClassTest "
    );

    console.log(
      "------ | --------------- | --------------- | --------------- | --------------"
    );
    console.log(
      "       |                 |                 |                 |"
    );
  }

  printEpochErrorLog(epoch_number, errors) {
    const formatted_errors = errors.map((error) =>
      error.toLocaleString("pt-BR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
    );

    const errors_line = formatted_errors.reduce(
      (prev, cur) => `${prev}     |     ${cur}`
    );

    console.log(`  ${epoch_number}    |     ${errors_line}`);
  }

  getOutputVector(sample: DataSample) {
    const x_vector: number[] = sample.in;
    const y_vector: number[] = sample.out;

    if (sample.onlyTestSample) {
      return this.rna.getOutput(x_vector);
    }

    return this.rna.train(x_vector, y_vector);
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
