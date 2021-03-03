import { DataSample } from "./data-sample.model";
import { plot as plotChart, Plot } from "nodeplotlib";

export class RNAResultPlotService {
  plot(results: RNATrainingResult[], samples: DataSample[]) {
    const classification_error_series = this.getClassificationErrorPlotSeries(
      results,
      samples
    );

    const approx_error_series = this.getApproxErrorPlotSeries(results);

    plotChart(classification_error_series, {
      title: "Erro de classificação",
      xaxis: {
        title: "Época",
      },
      yaxis: {
        title: "Erro proporcional",
      },
    });

    plotChart(approx_error_series, {
      title: "Erro de aproximação",
      xaxis: {
        title: "Época",
      },
      yaxis: {
        title: "Erro proporcionalproporcional",
      },
    });
  }

  getClassificationErrorPlotSeries(
    results: RNATrainingResult[],
    samples: DataSample[]
  ): Plot[] {
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

    return [
      {
        y: classification_error_series_test,
        type: "scatter",
        name: "Base de teste",
      },
      {
        y: classification_error_series_training,
        type: "scatter",
        name: "Base de treino",
      },
    ];
  }

  getApproxErrorPlotSeries(results: RNATrainingResult[]): Plot[] {
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

    return [
      {
        y: approx_error_series_test,
        type: "scatter",
        name: "Base de teste",
      },
      {
        y: approx_error_series_training,
        type: "scatter",
        name: "Base de treino",
      },
    ];
  }
}
