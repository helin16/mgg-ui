import MathHelper from '../../helper/MathHelper';

describe(`MathHelper`, () => {
  describe(`.add()`, () => {
    test.each([
      [3, 6, 9],
      [0.2, 1, 1.2],
      [1, 0.2, 1.2],
      [0.1, 0.2, 0.3],
      [76.65, 38.45, 115.1],
    ])(`%s + %s = %s`, (firstNumber, secondNumber, expected) => {
      expect(MathHelper.add(firstNumber, secondNumber)).toBe(expected);
      // expect(MathHelper.sub(firstNumber, secondNumber)).not.toBe(expectedNot);
    });
  });

  describe(`.sub()`, () => {
    test.each([
      [5, 6, -1],
      [11, 5, 6],
      [10.12, 5, 5.12],
      [10, 5.23, 4.77],
      [0.45, 0.15, 0.3],
      [43487.41, 40311.95, 3175.46],
      [8779.63, 21.023, 8758.607],
    ])(`%s - %s = %s`, (firstNumber, secondNumber, expected) => {
      expect(MathHelper.sub(firstNumber, secondNumber)).toBe(expected);
      // expect(MathHelper.sub(firstNumber, secondNumber)).not.toBe(expectedNot);
    });
  });

  describe(`.mul()`, () => {
    test.each([
      [3, 6, 18],
      [1.2, 2, 2.4],
      [2, 1.2, 2.4],
      [1.2, 0.2, 0.24],
      [0.4, 0.2, 0.08],
    ])(`%s * %s = %s`, (firstNumber, secondNumber, expected) => {
      expect(MathHelper.mul(firstNumber, secondNumber)).toBe(expected);
      // expect(MathHelper.mul(firstNumber, secondNumber)).not.toBe(expectedNot);
    });
  });

  describe(`.div()`, () => {
    test.each([
      [18, 6, 3],
      [1.2, 2, 0.6],
      [2.4, 1.2, 2],
      [1.2, 6, 0.2],
      [0.82, 10, 0.082],
      [0.82, 0.2, 4.1],
      [10, 3, 3.3333333333333335],
    ])(`%s / %s = %s`, (firstNumber, secondNumber, expected) => {
      expect(MathHelper.div(firstNumber, secondNumber)).toBe(expected);
    });
  });
});
