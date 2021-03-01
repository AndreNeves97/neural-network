import { DataSample } from "./data-sample.model";
import { SampleClass } from "./sample-class.model";

export type DataSetTrainingModel = {
  data: DataSample[];
  qtdHiddenLayerNeurons: number;
  epochs: number;
};

export class DataSetTraining {
  data: DataSample[];
  qtdHiddenLayerNeurons: number;
  epochs: number;

  min_input_values: number[] = [];
  max_input_values: number[] = [];

  min_output: number;
  max_output: number;

  static getInstance(model: DataSetTrainingModel): DataSetTraining {
    const obj = new DataSetTraining();

    obj.data = model.data;
    obj.qtdHiddenLayerNeurons = model.qtdHiddenLayerNeurons;
    obj.epochs = model.epochs;

    return obj;
  }

  optimizeSamples(
    normalize: boolean,
    dislocateOutputs: boolean,
    balanceClasses
  ) {
    if (balanceClasses) {
      // balance
    }

    if (normalize) {
      this.normalize();
    }

    SampleClass.splitIntoTestAndTrainSamples(this.data);

    this.data.forEach((sample, index) => {
      sample.sample_index = index;
    });

    if (dislocateOutputs) {
      this.dislocateSamplesOutput();
    }

    this.data.sort(() => Math.random() - 0.5);
    this.data.sort((a) => (a.onlyTestSample === false ? -1 : 1));

    this.setMinAndMaxOutputValues();
  }

  normalize() {
    this.data.forEach((sample) => {
      sample.in.forEach((value, i) => {
        this.setValueAsMinOrMaxInputForNeuron(i, value);
      });

      this.normalizeSample(sample);
    });
  }

  normalizeSample(sample) {
    sample.in = sample.in.map((input, index) => {
      const diff = this.max_input_values[index] - this.min_input_values[index];

      if (diff === 0) {
        return 1;
      }

      return (input - this.min_input_values[index]) / diff;
    });
  }

  dislocateSamplesOutput() {
    this.data.forEach((sample) => {
      sample.out = sample.out.map((value) => {
        if (value >= 0.5) {
          return value - 0.05;
        }

        return value + 0.05;
      });
    });
  }

  setValueAsMinOrMaxInputForNeuron(inputIndex, value) {
    if (
      this.min_input_values[inputIndex] === undefined ||
      value < this.min_input_values[inputIndex]
    ) {
      this.min_input_values[inputIndex] = value;
    }

    if (
      this.max_input_values[inputIndex] === undefined ||
      value > this.max_input_values[inputIndex]
    ) {
      this.max_input_values[inputIndex] = value;
    }
  }

  setMinAndMaxOutputValues() {
    this.data.forEach((sample) => {
      sample.out.forEach((value) => {
        if (this.min_output === undefined || value < this.min_output) {
          this.min_output = value;
        }

        if (this.max_output === undefined || value > this.max_output) {
          this.max_output = value;
        }
      });
    });
  }
}
