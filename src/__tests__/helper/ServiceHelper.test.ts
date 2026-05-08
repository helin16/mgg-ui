import {
  OP_AND,
  OP_BETWEEN,
  OP_EQ,
  OP_GT,
  OP_GTE,
  OP_LIKE,
  OP_LT,
  OP_LTE,
  OP_NOT,
  OP_OR,
} from '../../helper/ServiceHelper';

describe('ServiceHelper', () => {
  test('exports operator constants', () => {
    expect({
      OP_AND,
      OP_OR,
      OP_LIKE,
      OP_EQ,
      OP_GTE,
      OP_GT,
      OP_LT,
      OP_LTE,
      OP_NOT,
      OP_BETWEEN,
    }).toEqual({
      OP_AND: 'OP_AND',
      OP_OR: 'OP_OR',
      OP_LIKE: 'OP_LIKE',
      OP_EQ: 'OP_EQ',
      OP_GTE: 'OP_GTE',
      OP_GT: 'OP_GT',
      OP_LT: 'OP_LT',
      OP_LTE: 'OP_LTE',
      OP_NOT: 'OP_NOT',
      OP_BETWEEN: 'OP_BETWEEN',
    });
  });
});
