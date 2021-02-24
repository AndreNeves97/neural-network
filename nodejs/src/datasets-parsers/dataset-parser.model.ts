import { DataSample } from "../rna/data-sample.model";
import { SampleClass } from "../rna/sample-class.model";

const fs = require("fs");

export abstract class DatasetParser {
  min_values = [];
  max_values = [];

  readFile(file_path): DataSample[] {
    const data = fs.readFileSync(file_path).toString();

    return this.parseData(data);
  }

  parseData(data: string): DataSample[] {
    const samples: DataSample[] = data
      .split("\n")
      .filter((line) => line !== "")
      .map((line) => {
        const line_vector = line.split(",");
        return this.transformLineToSample(line_vector);
      });

    this.normalize(samples);
    SampleClass.splitIntoTestAndTrainSamples(samples);

    samples.sort(() => Math.random() - 0.5);

    return samples;
  }

  transformLineToSample(line: any[]): DataSample {
    const sample: DataSample = {
      in: this.getInputVector(line),
      out: this.getOutputVector(line),
    };

    return sample;
  }

  abstract getInputVector(line: any[]): number[];
  abstract getOutputVector(line: any[]): number[];

  defineMinMaxValue(inputIndex, value) {
    if (
      this.min_values[inputIndex] === undefined ||
      value < this.min_values[inputIndex]
    ) {
      this.min_values[inputIndex] = value;
    }

    if (
      this.max_values[inputIndex] === undefined ||
      value > this.max_values[inputIndex]
    ) {
      this.max_values[inputIndex] = value;
    }
  }

  normalize(samples: DataSample[]) {
    samples.forEach((sample) => this.normalizeSample(sample));
  }

  normalizeSample(sample) {
    sample.in = sample.in.map((input, index) => {
      const diff = this.max_values[index] - this.min_values[index];

      if (diff === 0) {
        return 1;
      }

      return (input - this.min_values[index]) / diff;
    });
  }

  getEnumeratedAttributeInput(index: string, min: number, max: number) {
    const output = Array.from({ length: max - min + 1 }, (_, index) => 0);

    const attribute_index = parseInt(index);
    output[attribute_index - min] = 1;

    return output;
  }

  getCustomEnumeratedAttributeInput(value, options) {
    return options.map((option) => {
      if (option === value) {
        return 1;
      }

      return 0;
    });
  }
}
