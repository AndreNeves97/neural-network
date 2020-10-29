import { Perceptron, PerceptronDataSample } from "./perceptron.model";


export class PerceptronTrainer {
  times: number;
  qtd_in: number;
  qtd_out: number;
  data: PerceptronDataSample[];

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
    const perceptron: Perceptron = new Perceptron(this.qtd_in, this.qtd_out, ni);

    console.log('Época \t|\t Erro da época \t\t|\t Diferença entre o erro da época anterior');
    console.log('----- \t|\t ----------------- \t|\t ----------------------------------------');
    console.log('      \t|\t                   \t|\t                                         ');

    let before_error_value = 0;
    
		for (let e = 0; e < this.times; e++) {
      let erro_epoca: number = 0;

			for (let a = 0; a < this.data.length; a++) {
        const sample: PerceptronDataSample = this.data[a];
        
        const x: number[] = sample.in;
        const y: number[] = sample.out;
          
        const o: number[] = perceptron.train(x, y);

        const errors = y.map((output, i) => Math.abs(output - o[i]));

				const erro_amostra = errors.reduce((acc, error_neuron) => acc + error_neuron);
				erro_epoca += erro_amostra;
      }

      const diff = Math.abs(erro_epoca - before_error_value);
      console.log(`${e} \t|\t ${erro_epoca} \t|\t ${diff}`);

      before_error_value = erro_epoca;
    }
  }
}