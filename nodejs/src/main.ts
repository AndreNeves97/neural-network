import { readFlags } from "./flags/read-flags";
import { DataSample } from "./rna/data-sample.model";
import { DataSetTraining } from "./rna/data-set-training.model";
import { Perceptron } from "./rna/perceptron/perceptron.model";
import { RNATrainerService } from "./rna/rna-trainer.service";
import { RNA } from "./rna/rna.interface";

main();

function main() {
  console.log("\n");

  const args = process.argv.slice(2);
  const problem = args[0];

  const problems = { robot, and, or, xor, flags };

  if (!problems.hasOwnProperty(problem)) {
    console.error(`[Error] Unimplemented problem: ${problem}`);
    return process.exit();
  }

  const dataSetTraining: DataSetTraining = problems[problem].apply(this);
  train(dataSetTraining);
}

function train(dataSetTraining: DataSetTraining) {
  const times = dataSetTraining.times;
  const data = dataSetTraining.data;

  const rna: RNA = getRNAObject(data);
  const trainer = new RNATrainerService(times, data, rna);

  trainer.train();
}

function getRNAObject(data: DataSample[]) {
  const qtd_in = data[0].in.length;
  const qtd_out = data[0].out.length;

  return new Perceptron(qtd_in, qtd_out);
}

function robot(): DataSetTraining {
  return {
    data: [
      { in: [0, 0, 0], out: [1, 1] },
      { in: [0, 0, 1], out: [0, 1] },
      { in: [0, 1, 0], out: [0, 1] },
      { in: [0, 1, 1], out: [0, 1] },
      { in: [1, 0, 0], out: [1, 0] },
      { in: [1, 0, 1], out: [1, 1] },
      { in: [1, 1, 0], out: [1, 0] },
      { in: [1, 1, 1], out: [1, 0] },
    ],
    times: 1000,
  };
}

function and(): DataSetTraining {
  return {
    data: [
      { in: [0, 0], out: [0] },
      { in: [0, 1], out: [0] },
      { in: [1, 0], out: [0] },
      { in: [1, 1], out: [1] },
    ],
    times: 1000,
  };
}

function or(): DataSetTraining {
  return {
    data: [
      { in: [0, 0], out: [0] },
      { in: [0, 1], out: [1] },
      { in: [1, 0], out: [1] },
      { in: [1, 1], out: [1] },
    ],
    times: 1000,
  };
}

function xor(): DataSetTraining {
  return {
    data: [
      { in: [0, 0], out: [0] },
      { in: [0, 1], out: [1] },
      { in: [1, 0], out: [1] },
      { in: [1, 1], out: [0] },
    ],
    times: 1000,
  };
}

function flags(): DataSetTraining {
  return { data: readFlags(), times: 1000 };
}
