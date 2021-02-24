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

      // if (e % 500 === 0) {
      this.printEpochErrorLog(e, result);
      // }
    }

    this.printSamplesInfo();

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
      "  nº\t|  eAproxTraining  |  eClassTraining  |   eAproxTest    |   eClassTest "
    );

    console.log(
      "----\t| ---------------- | ---------------- | --------------- | --------------"
    );
    console.log(
      "   \t|                  |                  |                 |"
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

    console.log(` ${epoch_number}\t|     ${errors_line}`);
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

  printSamplesInfo() {
    let training_samples_count = 0;
    let training_samples_percent = 0;

    let test_samples_count = 0;
    let test_samples_percent = 0;

    let total_samples = this.data.length;

    const samples_count_per_classes = {};

    this.data.forEach((sample) => {
      if (!samples_count_per_classes[sample.class.sample_index]) {
        samples_count_per_classes[sample.class.sample_index] = {
          training: 0,
          test: 0,
          sample,
        };
      }

      if (sample.onlyTestSample) {
        test_samples_count++;
        samples_count_per_classes[sample.class.sample_index].test++;
      } else {
        training_samples_count++;
        samples_count_per_classes[sample.class.sample_index].training++;
      }
    });

    training_samples_percent = (training_samples_count / total_samples) * 100;
    test_samples_percent = (test_samples_count / total_samples) * 100;

    Object.values(samples_count_per_classes).forEach((sample_info: any) => {
      sample_info.test_percent =
        sample_info.test / (sample_info.training + sample_info.test);

      sample_info.training_percent =
        sample_info.training / (sample_info.training + sample_info.test);
    });

    this.showSamplesInfoOutput({
      training_samples_count,
      training_samples_percent,
      test_samples_count,
      test_samples_percent,
      samples_count_per_classes,
    });
  }

  showSamplesInfoOutput({
    training_samples_count,
    training_samples_percent,
    test_samples_count,
    test_samples_percent,
    samples_count_per_classes,
  }) {
    console.log("\n\n\n\n");

    console.log("\n\n---------------------------------------");
    console.log("              Samples Info");
    console.log("---------------------------------------\n");

    console.log(
      "Traning samples:",
      training_samples_count,
      "(",
      Math.ceil(training_samples_percent * 100) / 100,
      "%)"
    );
    console.log(
      "Test samples:",
      test_samples_count,
      "(",
      Math.ceil(test_samples_percent * 100) / 100,
      "%)"
    );

    console.log();

    console.log("\n\n---------------------------------------");
    console.log("  Distribuição de amostras por classe");
    console.log("---------------------------------------");

    Object.values(samples_count_per_classes).forEach(
      (sample_info: any, index) => {
        console.log(`\nAmostra`, index, ":");

        console.log(
          "   Training: ",
          sample_info.training,
          "(",
          Math.ceil(sample_info.training_percent * 100) / 100,
          "%)"
        );

        console.log(
          "   Test: ",
          sample_info.test,
          "(",
          Math.ceil(sample_info.test_percent * 100) / 100,
          "%)"
        );

        console.log();
      }
    );

    console.log("\n\n---------------------------------------");
    console.log("          Ordem das amostras ");
    console.log("---------------------------------------");

    console.log(this.data.map((sample) => sample.sample_index));
  }
}
