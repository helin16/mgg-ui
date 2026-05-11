import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

jest.mock('@react-pdf/renderer', () => ({
  __esModule: true,
  Document: ({children}: any) => <div data-testid="document">{children}</div>,
  Page: ({children}: any) => <div data-testid="page">{children}</div>,
  Text: ({children}: any) => <span>{children}</span>,
  View: ({children}: any) => <div>{children}</div>,
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

import BPayBatchExportPdf from '../../../components/BPay/BPayBatchExportPdf';

describe('BPayBatchExportPdf', () => {
  test('renders batch summary and section item details', () => {
    const view = renderToStaticMarkup(
      <BPayBatchExportPdf
        batch={{
          createdAt: '2026-01-01T10:00:00Z',
          generatedAt: '2026-01-02T11:00:00Z',
          CreatedBy: {firstName: 'Ada', lastName: 'Lovelace'},
          Sections: [
            {
              id: 'section-1',
              title: 'ACME',
              totalAmount: 50,
              itemCount: 1,
              Creditor: {id: 77, name: 'ACME Supplies'},
              Items: [
                {
                  id: 'item-1',
                  amount: 50,
                  reference: 'REF-1',
                  billerCode: '12345',
                  creditorName: 'ACME Supplies',
                },
              ],
            },
          ],
        } as any}
      />
    );

    expect(view).toContain('BPay Batch Summary');
    expect(view).toContain('by Ada Lovelace');
    expect(view).toContain('ACME Supplies [77]');
    expect(view).toContain('REF-1');
    expect(view).toContain('$50.00');
  });
});
