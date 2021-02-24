import { DataSample } from "./data-sample.model";

export class SampleClass {
  sample_index: number;
  samples: DataSample[];

  setTestAndTrainSamples() {
    const samples_count = this.samples.length;

    const train_samples_count = Math.round(samples_count * 0.75);

    this.samples.forEach((sample, i) => {
      sample.onlyTestSample = i >= train_samples_count;
      sample.class = this;
    });
  }

  static splitIntoTestAndTrainSamples(samples): [string, SampleClass][] {
    const classes = SampleClass.splitSamplesClasses(samples);

    classes.forEach((classEntry) => {
      const obj = classEntry[1];

      obj.setTestAndTrainSamples();
    });

    return classes;
  }

  static splitSamplesClasses(samples: DataSample[]): [string, SampleClass][] {
    const classes: { [index: number]: SampleClass } = {};

    samples.forEach((sample: DataSample) => {
      const output_index = sample.out.indexOf(1);

      if (!classes[output_index]) {
        classes[output_index] = new SampleClass();
        classes[output_index].sample_index = output_index;
        classes[output_index].samples = [];
      }

      classes[output_index].samples.push(sample);
    });

    return Object.entries(classes);
  }
}
