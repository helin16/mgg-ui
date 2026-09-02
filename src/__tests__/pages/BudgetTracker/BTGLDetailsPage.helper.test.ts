import {
  canShowCreateOptions,
  getItemListReadOnly,
} from '../../../pages/BudgetTracker/BTGLDetailsPage';

describe('BTGLDetailsPage helpers - canShowCreateOptions', () => {
  test('unlocked year: options shown for anyone', () => {
    expect(canShowCreateOptions({ isDisabled: false, isExempt: false })).toBe(true);
    expect(canShowCreateOptions({ isDisabled: false, isExempt: true })).toBe(true);
  });

  test('locked year: options shown only for exempt users', () => {
    expect(canShowCreateOptions({ isDisabled: true, isExempt: true })).toBe(true);
    expect(canShowCreateOptions({ isDisabled: true, isExempt: false })).toBe(false);
  });
});

describe('BTGLDetailsPage helpers - getItemListReadOnly', () => {
  const BUDGET_YEAR = 2027;

  test('unlocked year: never read-only, regardless of role or viewed year', () => {
    expect(getItemListReadOnly({ isDisabled: false, isAdmin: false, isException: false, showingYear: 2020, budgetYear: BUDGET_YEAR })).toBe(false);
    expect(getItemListReadOnly({ isDisabled: false, isAdmin: false, isException: true, showingYear: 2020, budgetYear: BUDGET_YEAR })).toBe(false);
    expect(getItemListReadOnly({ isDisabled: false, isAdmin: true, isException: false, showingYear: 2020, budgetYear: BUDGET_YEAR })).toBe(false);
  });

  test('locked year: admin is never clamped, for any viewed year', () => {
    expect(getItemListReadOnly({ isDisabled: true, isAdmin: true, isException: false, showingYear: BUDGET_YEAR, budgetYear: BUDGET_YEAR })).toBe(false);
    expect(getItemListReadOnly({ isDisabled: true, isAdmin: true, isException: false, showingYear: 2024, budgetYear: BUDGET_YEAR })).toBe(false);
  });

  test('locked year: exception user is editable only on the budget year', () => {
    expect(getItemListReadOnly({ isDisabled: true, isAdmin: false, isException: true, showingYear: BUDGET_YEAR, budgetYear: BUDGET_YEAR })).toBe(false);
    expect(getItemListReadOnly({ isDisabled: true, isAdmin: false, isException: true, showingYear: 2026, budgetYear: BUDGET_YEAR })).toBe(true);
    expect(getItemListReadOnly({ isDisabled: true, isAdmin: false, isException: true, showingYear: 2024, budgetYear: BUDGET_YEAR })).toBe(true);
  });

  test('locked year: non-exempt user is always read-only', () => {
    expect(getItemListReadOnly({ isDisabled: true, isAdmin: false, isException: false, showingYear: BUDGET_YEAR, budgetYear: BUDGET_YEAR })).toBe(true);
    expect(getItemListReadOnly({ isDisabled: true, isAdmin: false, isException: false, showingYear: 2024, budgetYear: BUDGET_YEAR })).toBe(true);
  });

  test('locked year: admin wins when the user is both admin and exception, on any year', () => {
    expect(getItemListReadOnly({ isDisabled: true, isAdmin: true, isException: true, showingYear: 2024, budgetYear: BUDGET_YEAR })).toBe(false);
  });
});
