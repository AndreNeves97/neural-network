import { DataSample } from "./data-sample.model";

export type DataSetTraining = {
  data: DataSample[];
  qtdHiddenLayers: number;
  times: number;
};
