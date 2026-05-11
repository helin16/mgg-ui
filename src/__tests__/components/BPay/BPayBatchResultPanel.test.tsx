import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {
  DeleteConfirmPopupBtnKey,
  DeleteConfirmPopupBtnTestId,
} from '../../../components/common/DeleteConfirm/__mocks__/DeleteConfirmPopupBtn';
import BPayBatchResultPanel from '../../../components/BPay/BPayBatchResultPanel';

jest.mock('../../../components/common/Table');
jest.mock('../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn');

describe('BPayBatchResultPanel', () => {
  const batch = {
    id: 'batch-1',
    createdAt: '2026-01-01T10:00:00Z',
    totalAmount: 50,
    generatedAt: null,
    CreatedBy: {firstName: 'Ada', lastName: 'Lovelace'},
    Sections: [
      {
        id: 'section-1',
        title: 'ACME',
        totalAmount: 50,
        itemCount: 1,
        Creditor: {id: 77, name: 'ACME Supplies'},
        Items: [
          {id: 'item-1', amount: 50, reference: 'REF-1', billerCode: '12345', creditorName: 'ACME Supplies'},
        ],
      },
    ],
  } as any;

  test('renders batch list mode and opens a batch from the created date action', async () => {
    const onOpenBatch = jest.fn();
    render(
      <BPayBatchResultPanel
        batches={[{...batch, generatedAt: '2026-01-01T11:00:00Z'}]}
        onOpenBatch={onOpenBatch}
      />
    );

    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(onOpenBatch).toHaveBeenCalledWith(expect.objectContaining({id: 'batch-1'}));
    expect(screen.getByTestId(DeleteConfirmPopupBtnTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(DeleteConfirmPopupBtnKey).length).toBeGreaterThan(0);
  });

  test('renders batch detail mode and delegates item deletion', async () => {
    const onDeleteBatchItem = jest.fn();
    render(
      <BPayBatchResultPanel
        batch={batch}
        onDeleteBatchItem={onDeleteBatchItem}
      />
    );

    expect(screen.getByText('ACME Supplies [77]')).toBeInTheDocument();
    expect(screen.getByText('1 item(s) | Total $50.00')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', {name: ''}));
    expect(onDeleteBatchItem).toHaveBeenCalledWith(
      batch,
      batch.Sections[0],
      expect.objectContaining({id: 'item-1'})
    );
  });
});
