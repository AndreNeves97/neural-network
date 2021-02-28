import { BalanceScaleDatasetParser } from "./datasets-parsers/balance-scale/balance-scale-dataset-parser";
import { BreastCancerDatasetParser } from "./datasets-parsers/breast-cancer/breast-cancer-dataset-parser";
import { FlagsDatasetParser } from "./datasets-parsers/flags/flags-dataset-parser";
import { DataSetTraining } from "./rna/data-set-training.model";
import { MLP } from "./rna/mlp/mlp.model";
import { Perceptron } from "./rna/perceptron/perceptron.model";
import { RNATrainerService } from "./rna/rna-trainer.service";
import { RNAType } from "./rna/rna-type.enum";
import { RNA } from "./rna/rna.interface";

main();

function main() {
  console.log("\n");

  const args = process.argv.slice(2);
  const problem = args[0];
  const rnaType = args[1];
  const epochs = args[2];

  const problems = {
    robot,
    and,
    or,
    xor,
    flags,
    "balance-scale": balanceScale,
    "breast-cancer": breastCancer,
  };

  if (!problems.hasOwnProperty(problem)) {
    console.error(`[Error] Unimplemented problem: ${problem}`);
    return process.exit();
  }

  const dataSetTraining: DataSetTraining = problems[problem].apply(this, [
    epochs,
  ]);
  train(dataSetTraining, rnaType);
}

function train(dataSetTraining: DataSetTraining, rnaType: string) {
  const epochs = dataSetTraining.epochs;
  const data = dataSetTraining.data;

  const rna: RNA = getRNAObject(dataSetTraining, rnaType);
  const trainer = new RNATrainerService(epochs, data, rna);

  trainer.train();
}

function getRNAObject(dataSetTraining: DataSetTraining, rnaType: string) {
  const data = dataSetTraining.data;

  const qtdIn = data[0].in.length;
  const qtdOut = data[0].out.length;

  if (rnaType === RNAType.MLP) {
    const qtdHiddenLayers = dataSetTraining.qtdHiddenLayerNeurons;
    return new MLP(qtdIn, qtdHiddenLayers, qtdOut);
  }

  return new Perceptron(qtdIn, qtdOut);
}

function robot(epochs): DataSetTraining {
  return {
    data: [
      { in: [0, 0, 0], out: [1, 1] },
      { in: [0, 0, 1], out: [0, 1] },
      { in: [0, 1, 0], out: [0, 1] },
      { in: [0, 1, 1], out: [0, 1] },
      { in: [1, 0, 0], out: [1, 0] },
      { in: [1, 0, 1], out: [0, 1] },
      { in: [1, 1, 0], out: [1, 0] },
      { in: [1, 1, 1], out: [0, 1] },
    ],
    qtdHiddenLayerNeurons: 5,
    epochs: epochs || 1000,
  };
}

function and(epochs): DataSetTraining {
  return {
    data: [
      { in: [0, 0], out: [0] },
      { in: [0, 1], out: [0] },
      { in: [1, 0], out: [0] },
      { in: [1, 1], out: [1] },
    ],
    qtdHiddenLayerNeurons: 3,
    epochs: epochs || 1000,
  };
}

function or(epochs): DataSetTraining {
  return {
    data: [
      { in: [0, 0], out: [0] },
      { in: [0, 1], out: [1] },
      { in: [1, 0], out: [1] },
      { in: [1, 1], out: [1] },
    ],
    qtdHiddenLayerNeurons: 3,
    epochs: epochs || 1000,
  };
}

function xor(epochs): DataSetTraining {
  return {
    data: [
      { in: [0, 0], out: [0] },
      { in: [0, 1], out: [1] },
      { in: [1, 0], out: [1] },
      { in: [1, 1], out: [0] },
    ],
    qtdHiddenLayerNeurons: 4,
    epochs: epochs || 3000,
  };
}

function flags(epochs): DataSetTraining {
  const file_path =
    __dirname.replace("dist", "src") + "/datasets/flags/flags.data";

  const parser: FlagsDatasetParser = new FlagsDatasetParser();

  const data = parser.readFile(file_path);

  const qtdIn = data[0].in.length;
  const qtdOut = data[0].out.length;

  const qtdHiddenLayerNeurons = (qtdIn + qtdOut) / 2;

  return { data, qtdHiddenLayerNeurons, epochs: epochs || 30000 };
}

function balanceScale(epochs): DataSetTraining {
  const file_path =
    __dirname.replace("dist", "src") +
    "/datasets/balance-scale/balance-scale.data";

  const parser: BalanceScaleDatasetParser = new BalanceScaleDatasetParser();

  const data = parser.readFile(file_path);

  const qtdIn = data[0].in.length;
  const qtdOut = data[0].out.length;

  const qtdHiddenLayerNeurons = (qtdIn + qtdOut) / 2;

  return { data, qtdHiddenLayerNeurons, epochs: epochs || 1000 };
}

function breastCancer(epochs): DataSetTraining {
  const file_path =
    __dirname.replace("dist", "src") + "/datasets/breast-cancer/wdbc.data";

  const parser: BreastCancerDatasetParser = new BreastCancerDatasetParser();

  const data = parser.readFile(file_path);

  const qtdIn = data[0].in.length;
  const qtdOut = data[0].out.length;

  const qtdHiddenLayerNeurons = (qtdIn + qtdOut) / 2;

  return { data, qtdHiddenLayerNeurons, epochs: epochs || 1000 };
}
