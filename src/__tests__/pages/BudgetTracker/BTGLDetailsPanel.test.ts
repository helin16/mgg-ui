import { canShowDeleteForSelectedItems } from '../../../pages/BudgetTracker/components/BTGLDetailsPanel';

describe('BTGLDetailsPanel helpers', () => {
  test('allows delete for module admins with a selection', () => {
    expect(
      canShowDeleteForSelectedItems({
        isReadOnly: false,
        isModuleAdmin: true,
        currentUserSynergyId: 100,
        selectedItems: [
          { id: 1, creator_id: 200, approved: true },
        ],
      })
    ).toBe(true);
  });

  test('allows delete for the creator when every selected item is new', () => {
    expect(
      canShowDeleteForSelectedItems({
        isReadOnly: false,
        isModuleAdmin: false,
        currentUserSynergyId: 100,
        selectedItems: [
          { id: 1, creator_id: 100 },
          { id: 2, creator_id: 100 },
        ],
      })
    ).toBe(true);
  });

  test('blocks delete for non-admins when any selected item is not new or not created by them', () => {
    expect(
      canShowDeleteForSelectedItems({
        isReadOnly: false,
        isModuleAdmin: false,
        currentUserSynergyId: 100,
        selectedItems: [
          { id: 1, creator_id: 100, approved: true },
        ],
      })
    ).toBe(false);

    expect(
      canShowDeleteForSelectedItems({
        isReadOnly: false,
        isModuleAdmin: false,
        currentUserSynergyId: 100,
        selectedItems: [
          { id: 1, creator_id: 200 },
        ],
      })
    ).toBe(false);

    expect(
      canShowDeleteForSelectedItems({
        isReadOnly: true,
        isModuleAdmin: true,
        currentUserSynergyId: 100,
        selectedItems: [{ id: 1, creator_id: 100 }],
      })
    ).toBe(false);
  });
});
