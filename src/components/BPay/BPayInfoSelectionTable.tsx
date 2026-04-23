import React from 'react';
import {Button, FormControl} from 'react-bootstrap';
import Table, {iTableColumn} from '../common/Table';
import iSynCreditorBPayInfo from '../../types/Synergetic/Finance/iSynCreditorBPayInfo';
import {
  getBPayInfoBillerCode,
  getBPayInfoComments,
  getBPayInfoReference,
  parseAmountInput
} from './CreditorBPayPanelHelper';

const normalizeAmountInput = (value: string) => {
  const numericOnly = `${value || ''}`.replace(/[^0-9.]/g, '');
  const [whole = '', ...decimalParts] = numericOnly.split('.');
  if (decimalParts.length <= 0) {
    return whole;
  }
  return `${whole}.${decimalParts.join('')}`;
};

type iBPayInfoSelectionTable = {
  amountByRecordSeq?: {[key: number]: string};
  isSubmitting?: boolean;
  onAdd: (record: iSynCreditorBPayInfo) => void;
  onAmountChange: (record: iSynCreditorBPayInfo, value: string) => void;
  records: iSynCreditorBPayInfo[];
  isLoading?: boolean;
}

const BPayInfoSelectionTable = ({
  amountByRecordSeq = {},
  isSubmitting = false,
  onAdd,
  onAmountChange,
  records,
  isLoading = false,
}: iBPayInfoSelectionTable) => {
  const columns: iTableColumn<iSynCreditorBPayInfo>[] = [
    {
      key: 'billerCode',
      header: 'Biller Code',
      cell: (column, row) => <td key={column.key}>{getBPayInfoBillerCode(row)}</td>,
    },
    {
      key: 'referenceNum',
      header: 'Reference',
      cell: (column, row) => <td key={column.key}>{getBPayInfoReference(row)}</td>,
    },
    {
      key: 'notes',
      header: 'Notes',
      cell: (column, row) => <td key={column.key}>{getBPayInfoComments(row) || '-'}</td>,
    },
    {
      key: 'amount',
      header: '',
      cell: (column, row) => {
        const seq = row?.Seq || 0;
        const amountValue = amountByRecordSeq[seq] || '';
        const isAmountValid = parseAmountInput(amountValue).error === null;
        return (
          <td className={'text-right'} key={column.key}>
            <div className={'d-inline-flex align-items-center gap-2'}>
              <FormControl
                onChange={event => onAmountChange(row, normalizeAmountInput(event.target.value))}
                placeholder={'Amount'}
                size={'sm'}
                style={{width: '140px'}}
                value={amountByRecordSeq[seq] || ''}
              />
              <Button
                disabled={isSubmitting || !isAmountValid}
                onClick={() => onAdd(row)}
                size={'sm'}
                variant={'primary'}
              >
                +
              </Button>
            </div>
          </td>
        );
      },
    },
  ];

  return (
    <Table<iSynCreditorBPayInfo>
      hover
      isLoading={isLoading}
      rows={records}
      columns={columns}
      size={'sm'}
      striped
    />
  );
}

export default BPayInfoSelectionTable;
