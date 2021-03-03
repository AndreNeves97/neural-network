import { Random } from "../utils/random";
import { DataSample } from "./data-sample.model";

export type SampleClassesEntry = [string, SampleClass];

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

  static splitIntoTestAndTrainSamples(
    classes: SampleClassesEntry[]
  ): SampleClassesEntry[] {
    classes.forEach((classEntry) => {
      const obj = classEntry[1];

      obj.setTestAndTrainSamples();
    });

    return classes;
  }

  static splitSamplesClasses(samples: DataSample[]): SampleClassesEntry[] {
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

  static balanceClasses(classesEntries: SampleClassesEntry[]) {
    const classes = classesEntries.map((classEntry) => classEntry[1]);

    const class_with_more_samples = this.getClassWithMoreSamples(classes);

    classes.forEach((class_obj) =>
      class_obj.balanceClassSamples(class_with_more_samples)
    );
  }

  static getClassWithMoreSamples(classes: SampleClass[]) {
    return classes.reduce((previous, curr) => {
      if (curr.samples.length >= previous.samples.length) {
        return curr;
      }

      return previous;
    });
  }

  balanceClassSamples(ref_class: SampleClass) {
    const samples_count_diff = ref_class.samples.length - this.samples.length;

    for (let i = 0; i < samples_count_diff; i++) {
      const sample = this.samples[i];

      const noise = Random.getGaussian();

      const new_sample = {
        ...sample,
        in: sample.in.map((value) => value + noise),
      };

      this.samples.push(new_sample);
    }
  }
}
