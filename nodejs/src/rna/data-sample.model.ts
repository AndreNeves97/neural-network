import { SampleClass } from "./sample-class.model";

export type DataSample = {
  in: number[];
  out: number[];
  onlyTestSample?: boolean;
  class?: SampleClass;
};
