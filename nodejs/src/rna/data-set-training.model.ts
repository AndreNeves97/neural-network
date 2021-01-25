import { DataSample } from "./data-sample.model";

export type DataSetTraining = {
  data: DataSample[];
  qtdHiddenLayerNeurons: number;
  times: number;
};
