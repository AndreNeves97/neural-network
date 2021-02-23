import { DataSample } from "./data-sample.model";

export class RNAResultPlotService {
  plot(results: RNATrainingResult[], samples: DataSample[]) {
    const {
      classification_error_series_test,
      classification_error_series_training,
    } = this.getClassificationErrorSeries(results, samples);

    const {
      approx_error_series_test,
      approx_error_series_training,
    } = this.getApproxErrorSeries(results);

    console.log(
      classification_error_series_test,
      classification_error_series_training
    );

    console.log(approx_error_series_test, approx_error_series_training);
  }

  getClassificationErrorSeries(
    results: RNATrainingResult[],
    samples: DataSample[]
  ) {
    const num_samples = samples.length;

    const num_samples_test = samples.filter(
      (sample) => sample.onlyTestSample === true
    ).length;

    const num_samples_training = num_samples - num_samples_test;

    const classification_error_series_test = results.map(
      (result) => result.error_classification_epoch_test / num_samples_test
    );

    const classification_error_series_training = results.map(
      (result) =>
        result.error_classification_epoch_training / num_samples_training
    );

    return {
      classification_error_series_test,
      classification_error_series_training,
    };
  }

  getApproxErrorSeries(results: RNATrainingResult[]) {
    const max_error_test = results
      .map((result) => result.error_approx_epoch_test)
      .reduce((max, error) => Math.max(max, error));

    const max_error_training = results
      .map((result) => result.error_approx_epoch_training)
      .reduce((max, error) => Math.max(max, error));

    const approx_error_series_test = results.map(
      (result) => result.error_approx_epoch_test / max_error_test
    );

    const approx_error_series_training = results.map(
      (result) => result.error_approx_epoch_training / max_error_training
    );

    return {
      approx_error_series_test,
      approx_error_series_training,
    };
  }
}
