Nome: André Marcelino de Souza Neves

# Trabalho de algoritmos genéticos

- Contém a implementação do perceptrom simples para as bases
  - Controle de robô
  - Porta AND
  - Porta OR
  - Porta XOR
  - [Flags](https://archive.ics.uci.edu/ml/datasets/Flags)
  - [Balance Scale](https://archive.ics.uci.edu/ml/datasets/balance+scale)
  - [Breast Cancer](https://archive.ics.uci.edu/ml/datasets/Breast+Cancer+Wisconsin+(Diagnostic)) 




# Execução:

- Necessário ter instalado no ambiente:
  - Node.js
  - Yarn
  - NPM


- Executar:
  - `yarn install` 
    - Atualizar dependências
  - `yarn start <sample> <algorithm> <epochs> [arguments]` 

    - `sample`: Qual base será treinada. Opções:
      - robot
      - and
      - or
      - xor
      - flags
      - balance-scale
      - breast-cancer

    - `algorithm`: Qual algoritmo será utilizado. Opções:
      - mlp
      - perceptron (opção padrão) 
  
    - `epochs`: Por quantas épocas executar o treinamento.Valores padrões para cada base:
      - `robot`: 1000
      - `and`: 1000
      - `or`: 1000
      - `xor`: 3000
      - `flags`: 30000
      - `balance-scale`: 1000
      - `breast-cancer`: 1000

    - Global options (arguments):
      - `--no-normalize`: Não normalizar os dados
      - `--no-dislocated-output`: Não deslocar a saída
      - `--no-balanced-classes`: Não balancear as classes
      - `--no-quadratic-error`: Não utilizar cálculo de erro quadrático
