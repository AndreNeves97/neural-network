import { DatasetParser } from "../dataset-parser.model";

export class BalanceScaleDatasetParser extends DatasetParser {
  getInputVector(line): number[] {
    const data = [
      super.getEnumeratedAttributeInput(line[1], 1, 5),
      super.getEnumeratedAttributeInput(line[2], 1, 5),
      super.getEnumeratedAttributeInput(line[3], 1, 5),
      super.getEnumeratedAttributeInput(line[4], 1, 5),
    ];

    const input: any[] = data.flat();

    return input.map((item, i) => {
      const value = parseInt(item);
      super.defineMinMaxValue(i, value);

      return value;
    });
  }

  getOutputVector(line): number[] {
    return super.getCustomEnumeratedAttributeInput(line[0], this.classes_list);
  }

  get classes_list(): string[] {
    return ["L", "B", "R"];
  }
}
