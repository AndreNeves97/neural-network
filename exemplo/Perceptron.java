package br.cefetmg.ia.rna;

public class Perceptron {

	private int qtd_in;
	private int qtd_out;
	private double [][] pesos;
	private double ni;
	
	public Perceptron(int qtd_in, int qtd_out) {
		this(qtd_in, qtd_out, 0.3);
	}
	
	// Quantidade de variáveis de entrada
	// Quantidade de variáveis de saída
	public Perceptron(int qtd_in, int qtd_out, double ni) {
		this.qtd_in = qtd_in;
		this.qtd_out = qtd_out;
		this.ni = ni;
		
		pesos = new double[qtd_in+1][qtd_out];
		//Inicializar o valores dos pesos de forma aleatória.
	}
	
	public double [] treinar(double[] x, double [] y) {
		
		double [] o = new double[this.qtd_out];
		//Executar o vetor X + bias no(s) neurônio(s).
		//encontrando a saída o obitida.
		
		double [][] deltas = new double[qtd_in+1][qtd_out];
		//Calcular todos os deltas, neurônio por neurônio.
		
		//Atualizar a matriz de pesos.
		
		return o;
	}
	
}
