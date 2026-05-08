import fs from 'fs';
import path from 'path';

jest.mock('@react-pdf/renderer', () => ({
  PDFDownloadLink: () => null,
  Document: () => null,
  Page: () => null,
  Text: () => null,
  View: () => null,
  Image: () => null,
  StyleSheet: {
    create: (styles: any) => styles,
  },
  Font: {
    register: jest.fn(),
  },
}));

jest.mock('powerbi-client-react', () => ({
  PowerBIEmbed: () => null,
}));

jest.mock('powerbi-client', () => ({
  models: {},
}));

const layoutsRoot = path.resolve(__dirname, '../../layouts');

const getLayoutFiles = () => {
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
  visit(layoutsRoot);
  return files.sort();
};

describe('layout module coverage', () => {
  test.each(getLayoutFiles())('loads %s with exports', layoutFile => {
    const mod = require(layoutFile);
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
