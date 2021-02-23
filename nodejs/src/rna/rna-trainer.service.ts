import { DataSample } from "./data-sample.model";
import { RNAResultPlotService } from "./rna-result-plot.service";
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

    const training_results: RNATrainingResult[] = [];

    for (let e = 0; e < this.times; e++) {
      const result = this.trainEpoch();
      training_results.push(result);

      this.printEpochErrorLog(e, result);
    }

    const plot_service = new RNAResultPlotService();
    plot_service.plot(training_results, this.data);

    console.log("\n");
  }

  trainEpoch(): RNATrainingResult {
    const result: RNATrainingResult = {
      error_approx_epoch_test: 0,
      error_classification_epoch_test: 0,

      error_approx_epoch_training: 0,
      error_classification_epoch_training: 0,
    };

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
        result.error_approx_epoch_test += error_approx;
        result.error_classification_epoch_test += error_classification;
        continue;
      }

      result.error_approx_epoch_training += error_approx;
      result.error_classification_epoch_training += error_classification;
    }

    return result;
  }

  printLogHeader() {
    console.log(
      "  nº   |  eAproxTraining  |  eClassTraining  |   eAproxTest    |   eClassTest "
    );

    console.log(
      "------ | ---------------- | ---------------- | --------------- | --------------"
    );
    console.log(
      "       |                  |                  |                 |"
    );
  }

  printEpochErrorLog(epoch_number, errors: RNATrainingResult) {
    const errors_vector = [
      errors.error_approx_epoch_training,
      errors.error_classification_epoch_training,
      errors.error_approx_epoch_test,
      errors.error_classification_epoch_test,
    ];

    const formatted_errors = errors_vector.map((error) =>
      error.toLocaleString("pt-BR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
    );

    const errors_line = formatted_errors.reduce(
      (prev, cur) => `${prev}      |     ${cur}`
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
