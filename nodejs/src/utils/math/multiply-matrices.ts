export class MultiplyMatrices {
  static multiplyVectorAndMatrix(a, b) {
    const output_count = b[0].length;

    return Array.from({ length: output_count }, (_, output_index) => {
      const current_b_column = b.map((b_line) => b_line[output_index]);

      return this.multiplyLineWithColumn(a, current_b_column);
    });
  }

  static multiplyLineWithColumn(a, b_column: number[]) {
    return b_column.reduce((sum, b_column, i) => sum + a[i] * b_column, 0);
  }
}
