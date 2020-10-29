package br.cefetmg.ia.rna;

public class PerceptronTreinar {

	private static double [][][] base = 
	new double [][][] {
		{{0,0,0},{1,1}},
		{{0,0,1},{0,1}},
		{{0,1,0},{0,1}},
		{{0,1,1},{0,1}},
		{{1,0,0},{1,0}},
		{{1,0,1},{1,0}},
		{{1,1,0},{1,0}},
		{{1,1,1},{1,0}}
	};
	
	public static void main(String [] args) {
		
		
		Perceptron rna = new Perceptron(3, 2, 0.1);
		
		for (int e = 0; e < 1000; e++) {
			double erroEpoca = 0;
			
			for (int a = 0; a < base.length; a++) {
				double [][] amostra = base[a]; 
				double [] x = amostra[0];
				double [] y = amostra[1];
				
				
				// o = Saídas - Quantidade de saídas (neurônios) 
				// x = Entrada
				// y = Saída
				double [] o = rna.treinar(x, y);
				//Calcular o erro da amostra que foi treinada.
				double erroAmostra = 0; //substituir o zero pelo calculo
				
				erroEpoca += erroAmostra;
				
			}
			
			//Impressao da epoca e do seu erro.
			
			
		}
		
		
	}
	
}
