import { SampleClass } from "./sample-class.model";

export type DataSample = {
  sample_index?: number;

  in: number[];
  out: number[];
  onlyTestSample?: boolean;
  class?: SampleClass;
};
