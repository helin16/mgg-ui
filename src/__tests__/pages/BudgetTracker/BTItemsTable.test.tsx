import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BTItemsTable from '../../../pages/BudgetTracker/components/BTItemsTable';
jest.mock('../../../pages/BudgetTracker/components/BTItemCreatePopupBtn');

describe('BTItemsTable', () => {
  test('renders rows, sorts by category name, and formats amounts', () => {
    const view = renderToStaticMarkup(
      <BTItemsTable
        gl={{ GLCode: '708705', GLDescription: 'Boss Program' } as any}
        forYear={2027}
        items={[
          {
            id: 1,
            name: 'first item',
            description: 'reason 1',
            status: 'new',
            item_quantity: 2,
            item_cost: 50,
            approved_amount: 0,
            creator_id: 100,
            BTItemCategory: { name: 'Alpha' } as any,
          },
          {
            id: 2,
            name: 'second item',
            description: 'reason 2',
            status: 'approved',
            item_quantity: 1,
            item_cost: 75,
            approved_amount: 25,
            creator_id: 100,
            BTItemCategory: { name: 'Zulu' } as any,
          },
        ]}
        communityMap={{
          100: { Given1: 'Lin', Surname: 'He' } as any,
        }}
      />
    );

    expect(view).toContain('Category');
    expect(view).toContain('Item');
    expect(view).toContain('Req. Amt');
    expect(view).toContain('Appr. Amt');
    expect(view.indexOf('Zulu')).toBeLessThan(view.indexOf('Alpha'));
    expect(view).toContain('$100.00');
    expect(view).toContain('$75.00');
    expect(view).toContain('$25.00');
    expect(view).toContain('Lin He');
  });
});
