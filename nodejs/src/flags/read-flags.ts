import { DataSample } from "../rna/data-sample.model";
import { SampleClass } from "../rna/sample-class.model";
import { inputFlagsDataTranform } from "./input-data-transformer";

const fs = require("fs");

export function readFlags(): DataSample[] {
  const path = __dirname.replace("dist", "src") + "/flags.data";

  const data = fs.readFileSync(path).toString();

  const samples: DataSample[] = data
    .split("\n")
    .filter((line) => line !== "")
    .map((line) => {
      const line_vector = line.split(",");
      return transformLineToSample(line_vector);
    });

  normalize(samples);
  SampleClass.splitIntoTestAndTrainSamples(samples);

  return samples;
}

function transformLineToSample(line): DataSample {
  const sample: DataSample = {
    in: getInputVector(line),
    out: getOutputVector(line),
  };

  return sample;
}

function getOutputVector(line) {
  const output = Array.from({ length: 8 }, (_, index) => 0);

  const religion_index = parseInt(line[6]);
  output[religion_index] = 1;

  return output;
}

function getInputVector(line) {
  const data = inputFlagsDataTranform(line);

  const input = data.flat();

  input.map((item, i) => {
    const value = parseInt(item);
    defineMinMaxValue(i, value);

    return value;
  });

  return input;
}

const min_values = [];
const max_values = [];

function defineMinMaxValue(inputIndex, value) {
  if (min_values[inputIndex] === undefined || value < min_values[inputIndex]) {
    min_values[inputIndex] = value;
  }

  if (max_values[inputIndex] === undefined || value > max_values[inputIndex]) {
    max_values[inputIndex] = value;
  }
}

function normalize(samples: DataSample[]) {
  samples.forEach(normalizeSample);
}

function normalizeSample(sample) {
  sample.in = sample.in.map((input, index) => {
    const diff = max_values[index] - min_values[index];

    if (diff === 0) {
      return 1;
    }

    return (input - min_values[index]) / diff;
  });
}
