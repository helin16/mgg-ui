import BTItemService from '../../../services/BudgetTracker/BTItemService';
import {
  BT_ITEM_STATUS_APPROVED,
  BT_ITEM_STATUS_DECLINED,
  BT_ITEM_STATUS_NEW,
} from '../../../types/BudgetTacker/iBTItem';

describe('BTItemService', () => {
  test('getAmountByType returns requested, approved, declined and pending totals', () => {
    expect(
      BTItemService.getAmountByType({
        item_quantity: 2,
        item_cost: 15.5,
        approved: true,
        approved_amount: 20,
      })
    ).toEqual({
      requested: 31,
      approved: 20,
      declined: 0,
      pending: 0,
    });

    expect(
      BTItemService.getAmountByType({
        item_quantity: 3,
        item_cost: 10,
        declined: true,
      })
    ).toEqual({
      requested: 30,
      approved: 0,
      declined: 30,
      pending: 0,
    });

    expect(
      BTItemService.getAmountByType(
        {
          item_quantity: 1,
          item_cost: 12,
        },
        {
          requested: 10,
          approved: 5,
          declined: 7,
          pending: 2,
        }
      )
    ).toEqual({
      requested: 22,
      approved: 5,
      declined: 7,
      pending: 14,
    });
  });

  test('getBTItemStatusNameFromItem resolves declined, approved and new statuses', () => {
    expect(
      BTItemService.getBTItemStatusNameFromItem({ declined: true })
    ).toBe(BT_ITEM_STATUS_DECLINED);
    expect(
      BTItemService.getBTItemStatusNameFromItem({ approved: true })
    ).toBe(BT_ITEM_STATUS_APPROVED);
    expect(BTItemService.getBTItemStatusNameFromItem({})).toBe(
      BT_ITEM_STATUS_NEW
    );
  });
});
