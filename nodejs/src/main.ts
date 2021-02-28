import { BalanceScaleDatasetParser } from "./datasets-parsers/balance-scale/balance-scale-dataset-parser";
import { BreastCancerDatasetParser } from "./datasets-parsers/breast-cancer/breast-cancer-dataset-parser";
import { FlagsDatasetParser } from "./datasets-parsers/flags/flags-dataset-parser";
import { DataSetTraining } from "./rna/data-set-training.model";
import { MLP } from "./rna/mlp/mlp.model";
import { Perceptron } from "./rna/perceptron/perceptron.model";
import { RNATrainerService } from "./rna/rna-trainer.service";
import { RNAType } from "./rna/rna-type.enum";
import { RNA } from "./rna/rna.interface";

const problems = {
  robot,
  and,
  or,
  xor,
  flags,
  "balance-scale": balanceScale,
  "breast-cancer": breastCancer,
};

main(problems);

async function main(problems) {
  const args = getExecutionArgs();
  const { problem, rnaType, epochs } = args;

  console.log("\n");
  console.log("Params to run neural network:");
  console.log(args, "\n", "\n");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!problems.hasOwnProperty(problem)) {
    console.error(`[Error] Unimplemented problem: ${problem}`);
    return process.exit();
  }

  const dataSetTraining: DataSetTraining = problems[problem].apply(this, [
    epochs,
    args["--no-normalize"],
  ]);

  train(dataSetTraining, rnaType, !args["--no-quadratic-error"]);
}

function getExecutionArgs() {
  const args = process.argv.slice(2);

  const positionalArgs = args
    .slice(0, 3)
    .filter((arg) => !arg.startsWith("--"));

  const problem = positionalArgs[0];
  const rnaType = positionalArgs[1];
  const epochs = positionalArgs[2];

  const options = [
    "--no-normalize",
    "--no-dislocated-output",
    "--no-balanced-classes",
    "--no-quadratic-error",
  ];

  const optionsValues = {};

  options.forEach((option) => {
    optionsValues[option] = args.find((arg) => arg === option) != null;
  });

  return {
    problem,
    rnaType,
    epochs,
    ...optionsValues,
  };
}

function train(
  dataSetTraining: DataSetTraining,
  rnaType: string,
  useQuadraticError: boolean
) {
  const epochs = dataSetTraining.epochs;
  const data = dataSetTraining.data;

  const rna: RNA = getRNAObject(dataSetTraining, rnaType, useQuadraticError);
  const trainer = new RNATrainerService(epochs, data, rna);

  trainer.train();
}

function getRNAObject(
  dataSetTraining: DataSetTraining,
  rnaType: string,
  useQuadraticError: boolean
) {
  const data = dataSetTraining.data;

  const qtdIn = data[0].in.length;
  const qtdOut = data[0].out.length;

  if (rnaType === RNAType.MLP) {
    const qtdHiddenLayers = dataSetTraining.qtdHiddenLayerNeurons;
    return new MLP(qtdIn, qtdHiddenLayers, qtdOut, useQuadraticError);
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

function flags(epochs, noNormalize): DataSetTraining {
  const file_path =
    __dirname.replace("dist", "src") + "/datasets/flags/flags.data";

  const parser: FlagsDatasetParser = new FlagsDatasetParser();

  const data = parser.readFile(file_path, noNormalize);

  const qtdIn = data[0].in.length;
  const qtdOut = data[0].out.length;

  const qtdHiddenLayerNeurons = (qtdIn + qtdOut) / 2;

  return { data, qtdHiddenLayerNeurons, epochs: epochs || 30000 };
}

function balanceScale(epochs, noNormalize): DataSetTraining {
  const file_path =
    __dirname.replace("dist", "src") +
    "/datasets/balance-scale/balance-scale.data";

  const parser: BalanceScaleDatasetParser = new BalanceScaleDatasetParser();

  const data = parser.readFile(file_path, noNormalize);

  const qtdIn = data[0].in.length;
  const qtdOut = data[0].out.length;

  const qtdHiddenLayerNeurons = (qtdIn + qtdOut) / 2;

  return { data, qtdHiddenLayerNeurons, epochs: epochs || 1000 };
}

function breastCancer(epochs, noNormalize): DataSetTraining {
  const file_path =
    __dirname.replace("dist", "src") + "/datasets/breast-cancer/wdbc.data";

  const parser: BreastCancerDatasetParser = new BreastCancerDatasetParser();

  const data = parser.readFile(file_path, noNormalize);

  const qtdIn = data[0].in.length;
  const qtdOut = data[0].out.length;

  const qtdHiddenLayerNeurons = (qtdIn + qtdOut) / 2;

  return { data, qtdHiddenLayerNeurons, epochs: epochs || 1000 };
}
