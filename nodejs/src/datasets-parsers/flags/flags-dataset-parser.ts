import { DataSample } from "../../rna/data-sample.model";
import { DatasetParser } from "../dataset-parser.model";

export class FlagsDatasetParser extends DatasetParser {
  getOutputVector(line): number[] {
    const output = Array.from({ length: 8 }, () => 0);

    const output_index = parseInt(line[6]);
    output[output_index] = 1;

    return output;
  }

  getInputVector(line): number[] {
    const data = this.inputFlagsDataTranform(line);

    console.log(line, data);
    const input = data.flat();

    input.map((item, i) => {
      const value = parseInt(item);
      super.defineMinMaxValue(i, value);

      return value;
    });

    return input;
  }

  inputFlagsDataTranform(line): any[] {
    const data = [
      super.getEnumeratedAttributeInput(line[1], 1, 6),
      super.getEnumeratedAttributeInput(line[2], 1, 4),

      [line[3], line[4]],

      super.getEnumeratedAttributeInput(line[5], 1, 10),

      [line[7], line[8], line[9]],
      [line[10], line[11], line[12], line[13], line[14], line[15], line[16]],

      super.getCustomEnumeratedAttributeInput(line[17], this.colors_list),

      [line[18], line[19], line[20], line[21], line[22]],
      [line[23], line[24], line[25], line[26], line[27]],

      super.getCustomEnumeratedAttributeInput(line[28], this.colors_list),
      super.getCustomEnumeratedAttributeInput(line[29], this.colors_list),
    ];

    return data;
  }

  get colors_list(): string[] {
    return [
      "green",
      "black",
      "red",
      "white",
      "blue",
      "gold",
      "orange",
      "brown",
    ];
  }
}
