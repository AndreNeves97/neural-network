import { DatasetParser } from "../dataset-parser.model";

export class BreastCancerDatasetParser extends DatasetParser {
  getInputVector(line): number[] {
    const data = line.slice(2);

    const input: any[] = data.flat();

    return input.map((item, i) => {
      const value = parseFloat(item);
      super.defineMinMaxValue(i, value);

      return value;
    });
  }

  getOutputVector(line): number[] {
    return super.getCustomEnumeratedAttributeInput(line[1], this.classes_list);
  }

  get classes_list(): string[] {
    return ["M", "B"];
  }
}
