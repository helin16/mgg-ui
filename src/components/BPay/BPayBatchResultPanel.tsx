import React from 'react';
import {Alert, Button, Card} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import Table, {iTableColumn} from '../common/Table';
import iCreditorBPayBatch from '../../types/BPay/iCreditorBPayBatch';
import iCreditorBPayBatchSection from '../../types/BPay/iCreditorBPayBatchSection';
import iCreditorBPayBatchSectionItem from '../../types/BPay/iCreditorBPayBatchSectionItem';
import DeleteConfirmPopupBtn from '../common/DeleteConfirm/DeleteConfirmPopupBtn';
import {
  calculateBatchTotal,
  calculateSectionTotal,
  getBatchId,
  getBatchItemCount,
  getBatchSectionCount,
  getBatchSections,
  getBatchStatusLabel,
  getUserFullName,
  getSectionItems
} from './CreditorBPayPanelHelper';

type iBPayBatchResultPanel = {
  activeBatchActionId?: string | null;
  batch?: iCreditorBPayBatch | null;
  batches?: iCreditorBPayBatch[];
  onDownloadBatch?: (batch: iCreditorBPayBatch) => void | Promise<void>;
  onDeleteBatch?: (batch: iCreditorBPayBatch) => Promise<any>;
  onDeleteBatchItem?: (
    batch: iCreditorBPayBatch,
    section: iCreditorBPayBatchSection,
    item: iCreditorBPayBatchSectionItem
  ) => void;
  onOpenBatch?: (batch: iCreditorBPayBatch) => void | Promise<void>;
  onGenerateBatch?: (batch: iCreditorBPayBatch) => void | Promise<void>;
  successMessage?: string | null;
}

const BPayBatchResultPanel = ({
  activeBatchActionId = null,
  batch = null,
  batches = [],
  onDownloadBatch,
  onDeleteBatch,
  onDeleteBatchItem,
  onOpenBatch,
  onGenerateBatch,
  successMessage
}: iBPayBatchResultPanel) => {
  if (!batch && batches.length <= 0) {
    return null;
  }

  const itemColumns: iTableColumn<iCreditorBPayBatchSectionItem>[] = [
    {
      key: 'billerCode',
      header: 'Biller Code',
      cell: (column, row) => <td key={column.key}>{row?.billerCode || '-'}</td>,
    },
    {
      key: 'reference',
      header: 'Reference',
      cell: (column, row) => <td key={column.key}>{row?.reference || row?.reference1 || '-'}</td>,
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (column, row) => <td key={column.key}>${Number(row?.amount || row?.amt || 0).toFixed(2)}</td>,
    },
    ...(onDeleteBatchItem && batch ? [{
      key: 'delete',
      header: '',
      cell: (column: iTableColumn<iCreditorBPayBatchSectionItem>, row: iCreditorBPayBatchSectionItem) => (
        <td className={'text-right'} key={column.key}>
          <Button
            onClick={() => {
              const section = getBatchSections(batch).find(candidateSection => getSectionItems(candidateSection).some(candidateItem => {
                const candidateItemId = `${candidateItem?.id || candidateItem?.Id || ''}`.trim();
                const rowItemId = `${row?.id || row?.Id || ''}`.trim();
                return candidateItemId !== '' && candidateItemId === rowItemId;
              }));
              if (section) {
                onDeleteBatchItem(batch, section, row);
              }
            }}
            size={'sm'}
            variant={'outline-secondary'}
          >
            <Icons.Trash />
          </Button>
        </td>
      ),
    }] : []),
  ];

  const batchColumns: iTableColumn<iCreditorBPayBatch>[] = [
    {
      key: 'createdAt',
      header: 'Batch Created',
      cell: (column, row) => (
        <td key={column.key}>
          {row?.createdAt && onOpenBatch ? (
            <Button
              className={'p-0 align-baseline'}
              onClick={() => onOpenBatch?.(row)}
              size={'sm'}
              variant={'link'}
            >
              {new Date(row.createdAt).toLocaleString()}
            </Button>
          ) : row?.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}
          {row?.createdAt && getUserFullName(row?.CreatedBy) ? ` by ${getUserFullName(row?.CreatedBy)}` : ''}
        </td>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (column, row) => <td key={column.key}>{getBatchStatusLabel(row)}</td>,
    },
    {
      key: 'sections',
      header: 'Creditors',
      cell: (column, row) => <td key={column.key}>{getBatchSectionCount(row)}</td>,
    },
    {
      key: 'items',
      header: 'Items',
      cell: (column, row) => <td key={column.key}>{getBatchItemCount(row)}</td>,
    },
    {
      key: 'total',
      header: 'Total',
      cell: (column, row) => <td key={column.key}>${Number(row?.totalAmount || 0).toFixed(2)}</td>,
    },
    {
      key: 'generatedAt',
      header: 'Generated',
      cell: (column, row) => (
        <td key={column.key}>
          {row?.generatedAt ? (
            getUserFullName(row?.UpdatedBy || row?.CreatedBy)
              ? `${getUserFullName(row?.UpdatedBy || row?.CreatedBy)} @ ${new Date(row.generatedAt).toLocaleString()}`
              : new Date(row.generatedAt).toLocaleString()
          ) : '-'}
        </td>
      ),
    },
    {
      key: 'actions',
      header: (column: iTableColumn<iCreditorBPayBatch>) => <th className={'text-right'} key={column.key}></th>,
      cell: (column, row) => {
        const batchId = getBatchId(row);
        const isGenerated = Boolean(row?.generatedAt);
        const isBusy = activeBatchActionId !== null && activeBatchActionId === batchId;
        const createdAtLabel = row?.createdAt ? new Date(row.createdAt).toLocaleString() : 'Unknown date';
        const createdByLabel = getUserFullName(row?.CreatedBy);
        return (
          <td className={'text-right'} key={column.key}>
            {isGenerated ? (
              <Button
                disabled={!onDownloadBatch || isBusy}
                onClick={() => onDownloadBatch?.(row)}
                className={'me-2'}
                size={'sm'}
                variant={'outline-primary'}
              >
                Download again
              </Button>
            ) : null}
            <DeleteConfirmPopupBtn
              deletedCallbackFn={() => undefined}
              deletingFn={onDeleteBatch ? () => onDeleteBatch(row) : undefined}
              description={
                <>
                  You are about to delete BPay batch: <b>{createdAtLabel}</b>
                  {createdByLabel ? <> by <b>{createdByLabel}</b></> : null}
                </>
              }
              size={'sm'}
              title={'Delete this BPay batch'}
              variant={'outline-secondary'}
            >
              <Icons.Trash />
            </DeleteConfirmPopupBtn>
          </td>
        );
      }
    },
  ];

  if (batches.length > 0) {
    return (
      <div>
        {successMessage ? <Alert variant={'success'}>{successMessage}</Alert> : null}
        <Table<iCreditorBPayBatch>
          columns={batchColumns}
          hover
          rows={batches}
          responsive
          size={'sm'}
          striped
        />
      </div>
    );
  }

  return (
    <div>
      {successMessage ? <Alert variant={'success'}>{successMessage}</Alert> : null}
      {getBatchSections(batch).map((section: iCreditorBPayBatchSection, index: number) => (
        <Card className={'mb-3'} key={`${section.id || section.Id || index}`}>
            <Card.Body className={'no-padding'}>
            <Card.Title>
              {section.Creditor?.name
                ? `${section.Creditor.name} [${section.Creditor.id}]`
                : (section.customerName || section.title || `Section ${index + 1}`)}
            </Card.Title>
            <Card.Subtitle className={'mb-2 text-muted'}>
              {getSectionItems(section).length} item(s) | Total ${calculateSectionTotal(section).toFixed(2)}
            </Card.Subtitle>
            <Table<iCreditorBPayBatchSectionItem>
              columns={itemColumns}
              hover
              rows={getSectionItems(section)}
              size={'sm'}
              striped
            />
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default BPayBatchResultPanel;
