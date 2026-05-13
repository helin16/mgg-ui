jest.mock('@react-pdf/renderer', () => ({
  pdf: jest.fn(() => ({
    toBlob: jest.fn(),
  })),
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
