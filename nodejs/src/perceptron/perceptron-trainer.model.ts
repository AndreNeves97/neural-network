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

		for (let e = 0; e < this.times; e++) {
      let erroEpoca: number = 0;

      console.log(`\n======== Época ${e} ========\n`);


			for (let a = 0; a < this.data.length; a++) {
        const sample: PerceptronDataSample = this.data[a];
        
        const x: number[] = sample.in;
        const y: number[] = sample.out;
          
        console.log(`   ==== Amostra ${a} ====`);
        const o: number[] = perceptron.train(x, y);

        
				//Calcular o erro da amostra que foi treinada.
				const erroAmostra = 0; //substituir o zero pelo calculo
				
				erroEpoca += erroAmostra;
			}
    }
  }
}