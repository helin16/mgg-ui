import {
  buildBulkCreatePreviewRows,
  DEFAULT_CATEGORY_NAME,
  getBulkImportButtonLabel,
  parseNumericValue,
} from '../../../pages/BudgetTracker/components/BTItemBulkCreatePanel';

describe('BTItemBulkCreatePanel helpers', () => {
  test('parseNumericValue accepts floats and currency strings', () => {
    expect(parseNumericValue('12')).toBe(12);
    expect(parseNumericValue('12.5')).toBe(12.5);
    expect(parseNumericValue('$1,234.56')).toBe(1234.56);
    expect(parseNumericValue('abc')).toBeNull();
    expect(parseNumericValue('')).toBeNull();
  });

  test('buildBulkCreatePreviewRows flags duplicates and invalid numeric values', () => {
    const rows = buildBulkCreatePreviewRows({
      importedRows: [
        {
          rowNo: 2,
          name: 'Duplicate Name',
          description: 'Reason one',
          itemQuantity: 'abc',
          itemCost: '$10.50',
        },
        {
          rowNo: 3,
          name: 'Duplicate Name',
          description: '',
          itemQuantity: '1.5',
          itemCost: '$oops',
        },
      ],
      categories: [
        {
          id: 1,
          name: DEFAULT_CATEGORY_NAME,
          guid: 'cat-1',
          author_id: 100,
          destination_gl_code: '123',
          active: true,
        },
      ],
      existingItems: [
        {
          id: 90,
          name: 'Duplicate Name',
        },
      ],
    });

    expect(rows).toHaveLength(2);
    expect(rows[0].nameErrors).toContain('Duplicated Item Name');
    expect(rows[0].quantityErrors).toContain('Error');
    expect(rows[0].rawItemQuantity).toBe('abc');
    expect(rows[0].itemCost).toBe(10.5);
    expect(rows[1].nameErrors).toContain('Duplicated Item Name');
    expect(rows[1].rowErrors).toContain('Reason is required.');
    expect(rows[1].costErrors).toContain('Error');
    expect(rows[1].rawItemCost).toBe('$oops');
  });

  test('buildBulkCreatePreviewRows requires the As per Account category', () => {
    const rows = buildBulkCreatePreviewRows({
      importedRows: [
        {
          rowNo: 2,
          name: 'Item One',
          description: 'Reason',
          itemQuantity: '1',
          itemCost: '12',
        },
      ],
      categories: [],
      existingItems: [],
    });

    expect(rows[0].rowErrors).toContain(
      `Budget category "${DEFAULT_CATEGORY_NAME}" must exist as an active category.`
    );
  });

  test('getBulkImportButtonLabel formats the ready state and falls back to Import', () => {
    expect(
      getBulkImportButtonLabel({
        errorCount: 0,
        previewRowCount: 2,
        validRowCount: 2,
        validRowsTotalAmt: 211,
      })
    ).toBe('Import 2 items with Total Amt: $211.00');

    expect(
      getBulkImportButtonLabel({
        errorCount: 1,
        previewRowCount: 2,
        validRowCount: 1,
        validRowsTotalAmt: 100,
      })
    ).toBe('Import');
  });
});
