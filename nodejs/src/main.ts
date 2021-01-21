import { readFlags } from "./flags/read-flags";
import { DataSample } from "./rna/data-sample.model";
import { RNATrainerService } from "./rna/rna-trainer.service";

function main() {
  const args = process.argv.slice(2);

  console.log("\n");

  const problem = args[0];

  if (problem === "robot") {
    robot();
  }

  if (problem === "and") {
    and();
  }

  if (problem === "or") {
    or();
  }

  if (problem === "xor") {
    xor();
  }

  if (problem === "flags") {
    flags();
  }

  process.exit();
}

function robot() {
  const data: DataSample[] = [
    { in: [0, 0, 0], out: [1, 1] },
    { in: [0, 0, 1], out: [0, 1] },
    { in: [0, 1, 0], out: [0, 1] },
    { in: [0, 1, 1], out: [0, 1] },
    { in: [1, 0, 0], out: [1, 0] },
    { in: [1, 0, 1], out: [1, 1] },
    { in: [1, 1, 0], out: [1, 0] },
    { in: [1, 1, 1], out: [1, 0] },
  ];

  const times = 1000;
  const trainer = new RNATrainerService(times, data);
  trainer.train();
}

function and() {
  const data: DataSample[] = [
    { in: [0, 0], out: [0] },
    { in: [0, 1], out: [0] },
    { in: [1, 0], out: [0] },
    { in: [1, 1], out: [1] },
  ];

  const times = 1000;
  const trainer = new RNATrainerService(times, data);
  trainer.train();
}

function or() {
  const data: DataSample[] = [
    { in: [0, 0], out: [0] },
    { in: [0, 1], out: [1] },
    { in: [1, 0], out: [1] },
    { in: [1, 1], out: [1] },
  ];

  const times = 1000;
  const trainer = new RNATrainerService(times, data);
  trainer.train();
}

function xor() {
  const data: DataSample[] = [
    { in: [0, 0], out: [0] },
    { in: [0, 1], out: [1] },
    { in: [1, 0], out: [1] },
    { in: [1, 1], out: [0] },
  ];

  const times = 1000;
  const trainer = new RNATrainerService(times, data);
  trainer.train();
}

function flags() {
  const data: DataSample[] = readFlags();

  const times = 50000;
  const trainer = new RNATrainerService(times, data);
  trainer.train();
}

main();
