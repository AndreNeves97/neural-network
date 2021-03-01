import { DatasetParser } from "../dataset-parser.model";

export class BreastCancerDatasetParser extends DatasetParser {
  getInputVector(line): number[] {
    const data = line.slice(2);

    const input: any[] = data.flat();
    return input.map((item) => parseFloat(item));
  }

  getOutputVector(line): number[] {
    return super.getCustomEnumeratedAttributeInput(line[1], this.classes_list);
  }

  get classes_list(): string[] {
    return ["M", "B"];
  }
}
