// Possibilidade de melhoria:
//    Não usar índices para cor, e sim uma entrada para cada cor
//    Converter atributos enumerados para vetores neurônios, com 0 e 1
// landmass
// zone
// language
//
//

export function inputFlagsDataTranform(line): any[] {
  const data = [
    getEnumeratedAtributeInput(line[1], 1, 6),
    getEnumeratedAtributeInput(line[2], 1, 4),
    [line[3], line[4]],
    getEnumeratedAtributeInput(line[5], 1, 10),
    [line[7], line[8], line[9]],
    [line[10], line[11], line[12], line[13], line[14], line[15], line[16]],
    getColourAtributeInput(line[17]),
    [line[18], line[19], line[20], line[21], line[22]],
    [line[23], line[24], line[25], line[26], line[27]],
    getColourAtributeInput(line[28]),
    getColourAtributeInput(line[29]),
  ];

  return data;
}

function getEnumeratedAtributeInput(index, min, max) {
  const output = Array.from({ length: max - min + 1 }, (_, index) => 0);

  const religion_index = parseInt(index);
  output[religion_index - min] = 1;

  return output;
}

function getColourAtributeInput(colour) {
  const colours = [
    "green",
    "black",
    "red",
    "white",
    "blue",
    "gold",
    "orange",
    "brown",
  ];

  return colours.map((c) => {
    if (c === colour) {
      return 1;
    }

    return 0;
  });
}
