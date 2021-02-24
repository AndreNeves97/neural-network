import { DatasetParser } from "../dataset-parser.model";

export class BalanceScaleDatasetParser extends DatasetParser {
  getInputVector(line): number[] {
    const data = [line[1], line[2], line[3], line[4]];

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
