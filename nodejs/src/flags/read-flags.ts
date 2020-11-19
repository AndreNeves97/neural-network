import { PerceptronDataSample } from "../perceptron/perceptron.model";

const fs = require('fs')

export function readFlags(): PerceptronDataSample[] {
  const path = __dirname.replace('dist', 'src') + 
    '/flags.data'

  const data = fs
    .readFileSync(path)
    .toString()

  const samples: PerceptronDataSample[] = data
    .split('\n')
    .filter(line => line !== '')
    .map(line => {
      const line_vector = line.split(',');
      return transformLineToSample(line_vector);
    });

  normalize(samples);
  return samples
}



function transformLineToSample(line): PerceptronDataSample {
  const sample: PerceptronDataSample = {
    in: getInputVector(line),
    out: getOutputVector(line)
  }

  return sample;
}

function getOutputVector(line) {
  const output = Array.from(
    {length: 8}, 
    (_, index) => 0
  );
  
  const religion_index = parseInt(line[6]);
  output[religion_index] = 1;

  return output;
}

function getInputVector(line) {
  const input = [
    line[1],
    line[2],
    line[3],
    line[4],
    line[5],
    line[7],
    line[8],
    line[9],
    line[10],
    line[11],
    line[12],
    line[13],
    line[14],
    line[15],
    line[16],
    getColourIndex(line[17]),
    line[18],
    line[19],
    line[20],
    line[21],
    line[22],
    line[23],
    line[24],
    line[25],
    line[26],
    line[27],
    getColourIndex(line[28]),
    getColourIndex(line[29])
  ]
  .map((item, i) => {
    const value = parseInt(item);
    defineMinMaxValue(i, value);

    return value;
  });

  return input;
}


function getColourIndex(colour) {
  const colours = [
    'green',
    'black',
    'red',
    'white',
    'blue',
    'gold',
    'orange',
    'brown'
  ];

  const index = colours
    .findIndex(item => item === colour);
      
  if(index === -1) {
    return colours.length
  }

  return index;
}

const min_values = []
const max_values = []

function defineMinMaxValue(inputIndex, value) {
  if(min_values[inputIndex] === undefined || value < min_values[inputIndex]) {
    min_values[inputIndex] = value;
  }

  if(max_values[inputIndex] === undefined || value > max_values[inputIndex]) {
    max_values[inputIndex] = value;
  }
}

function normalize(samples: PerceptronDataSample[]) {
  samples.forEach(normalizeSample);
}

function normalizeSample(sample) {
  sample.in = sample.in.map((input, index) => {
    const diff = max_values[index] - min_values[index];

    if(diff === 0) {
      return 1;
    }

    return (input - min_values[index]) / diff;
  });
}