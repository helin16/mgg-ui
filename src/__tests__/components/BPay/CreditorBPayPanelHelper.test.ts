import {
  appendItemToBatch,
  findExistingSectionForCreditor,
  getBatchItemCount,
  getBatchStatusLabel,
  getAutoSelectedBPayInfo,
  getPersistedBatches,
  hasUnsavedBatchEntry,
  parseAmountInput,
  removeItemFromBatch,
  sortBatchesByCreatedDesc,
  shouldDisableNewBatchAction,
} from '../../../components/BPay/CreditorBPayPanelHelper';

describe('CreditorBPayPanelHelper', () => {
  test('parseAmountInput rejects empty and non-positive amounts', () => {
    expect(parseAmountInput('').error).toBe('Amount is required.');
    expect(parseAmountInput('0').error).toBe('Amount must be greater than zero.');
    expect(parseAmountInput('-1').error).toBe('Amount must be greater than zero.');
    expect(parseAmountInput('2.5').amount).toBe(2.5);
  });

  test('getAutoSelectedBPayInfo returns the only record', () => {
    const record = {
      Seq: 1,
      CreditorID: 10,
      BPayBillerCode: '123',
      BPayReference: 'ABC',
      Notes: null,
      IsActive: true,
      CreatedBy: null,
      CreatedAt: '2026-01-01',
      UpdatedBy: null,
      UpdatedAt: '2026-01-01',
    };
    expect(getAutoSelectedBPayInfo([record])).toEqual(record);
    expect(getAutoSelectedBPayInfo([record, {...record, Seq: 2}])).toBeNull();
  });

  test('findExistingSectionForCreditor matches by creditorId', () => {
    const creditor = {
      CreditorID: 5,
      CreditorNameExternal: 'Vendor One',
      CreditorNameInternal: 'Vendor One',
    };
    const section = {
      id: '1',
      isActive: true,
      createdAt: '',
      createdById: '',
      updatedAt: '',
      updatedById: '',
      batchId: 1,
      creditorId: 5,
      title: 'Vendor One',
      totalAmount: 0,
      itemCount: 0,
    };
    // @ts-ignore
    expect(findExistingSectionForCreditor([section], creditor)).toEqual(section);
  });

  test('appendItemToBatch appends to existing section and recalculates totals', () => {
    const batch = {
      id: 'batch-1',
      isActive: true,
      createdAt: '',
      createdById: '',
      updatedAt: '',
      updatedById: '',
      creditorId: null,
      totalAmount: 10,
      generatedAt: null,
      comments: null,
      content: null,
      Sections: [
        {
          id: 'section-1',
          isActive: true,
          createdAt: '',
          createdById: '',
          updatedAt: '',
          updatedById: '',
          batchId: 1,
          creditorId: 7,
          title: 'Vendor',
          totalAmount: 10,
          itemCount: 1,
          Items: [
            {
              id: 'item-1',
              isActive: true,
              createdAt: '',
              createdById: '',
              updatedAt: '',
              updatedById: '',
              sectionId: 1,
              creditorId: 7,
              amount: 10,
              reference: 'A',
              billerCode: 'B',
              creditorName: 'Vendor',
              description: null,
              dueDate: null,
            },
          ],
        },
      ],
    };
    const section = batch.Sections[0];
    const item = {
      id: 'item-2',
      isActive: true,
      createdAt: '',
      createdById: '',
      updatedAt: '',
      updatedById: '',
      sectionId: 1,
      creditorId: 7,
      amount: 5,
      reference: 'B',
      billerCode: 'C',
      creditorName: 'Vendor',
      description: null,
      dueDate: null,
    };
    // @ts-ignore
    const result = appendItemToBatch(batch, section, item);
    expect(result.totalAmount).toBe(15);
    expect(result.Sections[0].itemCount).toBe(2);
    expect(result.Sections[0].Items).toHaveLength(2);
  });

  test('removeItemFromBatch removes an item and prunes empty sections', () => {
    const batch = {
      id: 'batch-1',
      isActive: true,
      createdAt: '',
      createdById: '',
      updatedAt: '',
      updatedById: '',
      creditorId: null,
      totalAmount: 15,
      generatedAt: null,
      comments: null,
      content: null,
      Sections: [
        {
          id: 'section-1',
          isActive: true,
          createdAt: '',
          createdById: '',
          updatedAt: '',
          updatedById: '',
          batchId: 1,
          creditorId: 7,
          title: 'Vendor',
          totalAmount: 15,
          itemCount: 2,
          Items: [
            {
              id: 'item-1',
              isActive: true,
              createdAt: '',
              createdById: '',
              updatedAt: '',
              updatedById: '',
              sectionId: 1,
              creditorId: 7,
              amount: 10,
              reference: 'A',
              billerCode: 'B',
              creditorName: 'Vendor',
              description: null,
              dueDate: null,
            },
            {
              id: 'item-2',
              isActive: true,
              createdAt: '',
              createdById: '',
              updatedAt: '',
              updatedById: '',
              sectionId: 1,
              creditorId: 7,
              amount: 5,
              reference: 'B',
              billerCode: 'C',
              creditorName: 'Vendor',
              description: null,
              dueDate: null,
            },
          ],
        },
      ],
    };
    // @ts-ignore
    const result = removeItemFromBatch(batch, batch.Sections[0], batch.Sections[0].Items[0]);
    expect(result.totalAmount).toBe(5);
    expect(result.Sections).toHaveLength(1);
    expect(result.Sections[0].Items).toHaveLength(1);
    // @ts-ignore
    const pruned = removeItemFromBatch(result, result.Sections[0], result.Sections[0].Items[0]);
    expect(pruned.totalAmount).toBe(0);
    expect(pruned.Sections).toHaveLength(0);
  });

  test('hasUnsavedBatchEntry detects draft state in create mode', () => {
    expect(hasUnsavedBatchEntry({amount: ''})).toBe(false);
    expect(hasUnsavedBatchEntry({amount: '15.00'})).toBe(true);
    // @ts-ignore
    expect(hasUnsavedBatchEntry({selectedCreditor: {CreditorID: 9}})).toBe(true);
  });

  test('getBatchItemCount prefers item arrays and falls back to itemCount', () => {
    const withItems = {
      Sections: [
        {Items: [{id: '1'}, {id: '2'}], itemCount: 1},
        {Items: [], itemCount: 3},
      ],
    };
    const withoutItems = {
      Sections: [
        {itemCount: 2},
        {itemCount: 1},
      ],
    };
    // @ts-ignore
    expect(getBatchItemCount(withItems)).toBe(5);
    // @ts-ignore
    expect(getBatchItemCount(withoutItems)).toBe(3);
  });

  test('shouldDisableNewBatchAction blocks create mode while list state is unresolved', () => {
    expect(shouldDisableNewBatchAction(true, false)).toBe(true);
    expect(shouldDisableNewBatchAction(false, true)).toBe(true);
    expect(shouldDisableNewBatchAction(false, false)).toBe(false);
  });

  test('getBatchStatusLabel returns NEW until generatedAt exists', () => {
    expect(getBatchStatusLabel({generatedAt: null} as any)).toBe('NEW');
    expect(getBatchStatusLabel({generatedAt: '2026-04-22T10:00:00.000Z'} as any)).toBe('GENERATED');
  });

  test('getPersistedBatches removes malformed or inactive rows', () => {
    const rows = [
      {id: 'batch-1', isActive: true},
      {id: '', isActive: true},
      {Id: 'legacy-1', isActive: true},
      {id: 'batch-2', isActive: false},
    ];
    expect(getPersistedBatches(rows as any)).toEqual([
      {id: 'batch-1', isActive: true},
      {Id: 'legacy-1', isActive: true},
    ]);
  });

  test('sortBatchesByCreatedDesc keeps newest batches first', () => {
    const rows = [
      {id: 'batch-1', createdAt: '2026-04-20T10:00:00.000Z'},
      {id: 'batch-2', createdAt: '2026-04-22T10:00:00.000Z'},
      {id: 'batch-3', createdAt: '2026-04-21T10:00:00.000Z'},
    ];
    expect(sortBatchesByCreatedDesc(rows as any).map(batch => batch.id)).toEqual([
      'batch-2',
      'batch-3',
      'batch-1',
    ]);
  });
});
