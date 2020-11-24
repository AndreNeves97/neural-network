import { Perceptron, PerceptronDataSample } from "./perceptron.model";


export class PerceptronTrainer {
  times: number;
  qtd_in: number;
  qtd_out: number;
  data: PerceptronDataSample[];

  perceptron: Perceptron;

  constructor(times: number, data: PerceptronDataSample[]) {
    const qtd_in    = data[0].in.length;
    const qtd_out   = data[0].out.length;

    this.times = times;
    this.qtd_in = qtd_in;
    this.qtd_out = qtd_out;
    this.data = data;
  }

  train() {
    const ni = 0.3;
    this.perceptron = new Perceptron(this.qtd_in, this.qtd_out, ni);

    console.log('Época \t|\t Erro de aproximação \t|\t Erro de classificação ');
    console.log('----- \t|\t ------------------- \t|\t ----------------------');
    console.log('      \t|\t                     \t|\t                       ');

		for (let e = 0; e < this.times; e++) {
      this.trainEra(e);
    }
  }

  trainEra(era_number) {
    let error_approx_era: number = 0;
    let error_classification_era: number = 0;

    for (let a = 0; a < this.data.length; a++) {
      const sample: PerceptronDataSample = this.data[a];
      
      const x: number[] = sample.in;
      const y: number[] = sample.out;
        
      const o: number[] = this.perceptron.train(x, y);

      
      const error_approx_sample = this.getErrorApproxSample(y, o);
      error_approx_era          +=  error_approx_sample;

      const error_classification_sample = this.getErrorClassificationSample(y, o);
      error_classification_era  +=  error_classification_sample;
    }

    console.log(`${era_number} \t|\t ${error_approx_era} \t|\t ${error_classification_era} `);
  }

  getErrorApproxSample(y, o) {
    return y
      .map(
        (output, i) => Math.abs(output - o[i])
      )
      .reduce(
        (acc, error_neuron) => acc + error_neuron
      );
  }

  getErrorClassificationSample(y, o) {
    const sum_threshold_error = o
      .map(
        (value) => value < 0.5? 0 : 1
      )
      .map(
        (threshold, i) => Math.abs(y[i] - threshold)
      )
      .reduce(
        (acc, error_neuron) => acc + error_neuron
      );

      
    if(sum_threshold_error > 0) {
      return 1;
    }

    return 0;
  }
}