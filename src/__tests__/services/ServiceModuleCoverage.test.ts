import fs from 'fs';
import path from 'path';

const servicesRoot = path.resolve(__dirname, '../../services');

const getServiceFiles = () => {
  const files: string[] = [];
  const visit = (dir: string) => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        return;
      }
      if (/\.(ts|tsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    });
  };
  visit(servicesRoot);
  return files.sort();
};

describe('services module coverage', () => {
  test.each(getServiceFiles())('loads %s with usable exports', serviceFile => {
    const mod = require(serviceFile);
    const exported = mod.default || mod;
    const values = typeof exported === 'object' ? Object.values(exported) : [];

    expect(exported).toBeTruthy();
    expect(typeof exported === 'function' || values.length > 0).toBe(true);
    expect(
      typeof exported === 'function' || values.some(value => typeof value === 'function')
    ).toBe(true);
  });
});
