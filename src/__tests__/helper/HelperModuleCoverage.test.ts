import fs from 'fs';
import path from 'path';

const helperRoot = path.resolve(__dirname, '../../helper');

const getHelperFiles = () => {
  return fs
    .readdirSync(helperRoot)
    .filter(file => /\.(ts|tsx)$/.test(file))
    .map(file => path.join(helperRoot, file))
    .sort();
};

describe('helper module coverage', () => {
  test.each(getHelperFiles())('loads %s with usable exports', helperFile => {
    const mod = require(helperFile);
    const exported = mod.default || mod;
    const values = typeof exported === 'object' ? Object.values(exported) : [];

    expect(exported).toBeTruthy();
    expect(typeof exported === 'function' || values.length > 0).toBe(true);
    expect(
      typeof exported === 'function' ||
      values.some(value => typeof value === 'function' || typeof value === 'string')
    ).toBe(true);
  });
});
