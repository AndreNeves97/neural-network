import { PerceptronTrainer } from "./perceptron/perceptron-trainer.model";
import { PerceptronDataSample } from "./perceptron/perceptron.model";


function main() {
  const args = process.argv.slice(2);;

  const problem = args[0];

  if(problem === 'robot') {
    robot();
  }

  if(problem === 'and') {
    and();
  }

  if(problem === 'and') {
    and();
  }

  if(problem === 'or') {
    or();
  }

  if(problem === 'or') {
    xor();
  }

  process.exit();
}


function robot() {
  const data: PerceptronDataSample[] = [
    { in: [0, 0, 0], out: [1, 1] },
    { in: [0, 0, 1], out: [0, 1] },
    { in: [0, 1, 0], out: [0, 1] },
    { in: [0, 1, 1], out: [0, 1] },
    { in: [1, 0, 0], out: [1, 0] },
    { in: [1, 0, 1], out: [1, 1] },
    { in: [1, 1, 0], out: [1, 0] },
    { in: [1, 1, 1], out: [0, 0] }
  ];

  const times = 4;
  const trainer = new PerceptronTrainer(times, data);
  trainer.train();
}

function and() {
  const data: PerceptronDataSample[] = [
    { in: [0, 0], out: [0] },
    { in: [0, 1], out: [0] },
    { in: [1, 0], out: [0] },
    { in: [1, 1], out: [1] }
  ];

  const times = 50000;
  const trainer = new PerceptronTrainer(times, data);
  trainer.train();
}

function or() {
  const data: PerceptronDataSample[] = [
    { in: [0, 0], out: [0] },
    { in: [0, 1], out: [1] },
    { in: [1, 0], out: [1] },
    { in: [1, 1], out: [1] }
  ];

  const times = 50000;
  const trainer = new PerceptronTrainer(times, data);
  trainer.train();
}

function xor() {
  const data: PerceptronDataSample[] = [
    { in: [0, 0], out: [0] },
    { in: [0, 1], out: [1] },
    { in: [1, 0], out: [1] },
    { in: [1, 1], out: [0] }
  ];

  const times = 50000;
  const trainer = new PerceptronTrainer(times, data);
  trainer.train();
}


main();