import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BPayInfoSelectionTable from '../../../components/BPay/BPayInfoSelectionTable';

jest.mock('../../../components/common/Table');

describe('BPayInfoSelectionTable', () => {
  const record = {
    Seq: 1,
    BPayBillerCode: '12345',
    BPayReference: 'REF-1',
    Notes: 'Invoice 1',
    IsActive: true,
  } as any;

  test('normalizes amount input and forwards add actions', async () => {
    const onAdd = jest.fn();
    const onAmountChange = jest.fn();
    const {rerender} = render(
      <BPayInfoSelectionTable
        amountByRecordSeq={{1: ''}}
        onAdd={onAdd}
        onAmountChange={onAmountChange}
        records={[record]}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Amount'), {
      target: {value: '$12.3a4'},
    });
    expect(onAmountChange).toHaveBeenCalledWith(record, '12.34');

    rerender(
      <BPayInfoSelectionTable
        amountByRecordSeq={{1: '12.34'}}
        onAdd={onAdd}
        onAmountChange={onAmountChange}
        records={[record]}
      />
    );

    await userEvent.click(screen.getByRole('button', {name: '+'}));
    expect(onAdd).toHaveBeenCalledWith(record);
  });

  test('disables the add button while submitting or when amount is invalid', () => {
    const {rerender} = render(
      <BPayInfoSelectionTable
        amountByRecordSeq={{1: '0'}}
        isSubmitting={false}
        onAdd={jest.fn()}
        onAmountChange={jest.fn()}
        records={[record]}
      />
    );

    expect(screen.getByRole('button', {name: '+'})).toBeDisabled();

    rerender(
      <BPayInfoSelectionTable
        amountByRecordSeq={{1: '10'}}
        isSubmitting
        onAdd={jest.fn()}
        onAmountChange={jest.fn()}
        records={[record]}
      />
    );

    expect(screen.getByRole('button', {name: '+'})).toBeDisabled();
  });
});
