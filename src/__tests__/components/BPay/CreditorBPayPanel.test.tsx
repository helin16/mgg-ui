import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {EmptyStateKey, EmptyStateTestId} from '../../../components/common/__mocks__/EmptyState';
import {PopupModalKey, PopupModalTestId} from '../../../components/common/__mocks__/PopupModal';
import {
  BPayBatchResultPanelKey,
  BPayBatchResultPanelTestId,
} from '../../../components/BPay/__mocks__/BPayBatchResultPanel';
import {
  SynCreditorSelectorKey,
  SynCreditorSelectorTestId,
} from '../../../components/synCreditor/__mocks__/SynCreditorSelector';
import CreditorBPayPanel from '../../../components/BPay/CreditorBPayPanel';
import CreditorBPayBatchService from '../../../services/BPay/CreditorBPayBatchService';
import SynCreditorBPayInfoService from '../../../services/Synergetic/Finance/SynCreditorBPayInfoService';
import Toaster from '../../../services/Toaster';

jest.mock('../../../components/ExplanationPanel');
jest.mock('../../../components/synCreditor/SynCreditorSelector');
jest.mock('../../../components/form/FormLabel');
jest.mock('../../../components/form/FormErrorDisplay');
jest.mock('../../../components/BPay/BPayInfoSelectionTable');
jest.mock('../../../components/BPay/BPayBatchExportPdf');
jest.mock('../../../components/common/EmptyState');
jest.mock('../../../components/common/PopupModal');
jest.mock('../../../components/BPay/BPayBatchResultPanel');
jest.mock('../../../services/BPay/CreditorBPayBatchService', () => ({
  __esModule: true,
  default: {
    getBatchList: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    get: jest.fn(),
    deactivate: jest.fn(),
  },
}));
jest.mock('../../../services/Synergetic/Finance/SynCreditorBPayInfoService', () => ({
  __esModule: true,
  default: {
    getActiveByCreditorId: jest.fn(),
  },
}));
jest.mock('../../../services/Toaster');
jest.mock('jszip', () => {
  return jest.fn().mockImplementation(() => ({
    file: jest.fn(),
    generateAsync: jest.fn(),
  }));
});
jest.mock('@react-pdf/renderer', () => ({
  __esModule: true,
  pdf: jest.fn(() => ({
    toBlob: jest.fn(),
  })),
}));

describe('CreditorBPayPanel', () => {
  ComponentTestHelper.prepare();

  const mockedBatchService = CreditorBPayBatchService as jest.Mocked<typeof CreditorBPayBatchService>;
  const mockedBPayInfoService = SynCreditorBPayInfoService as jest.Mocked<typeof SynCreditorBPayInfoService>;
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  beforeEach(() => {
    mockedBatchService.getBatchList.mockResolvedValue({data: []} as any);
    mockedBPayInfoService.getActiveByCreditorId.mockResolvedValue([] as any);
  });

  test('renders the empty-state list when there are no batches', async () => {
    render(<CreditorBPayPanel />);

    expect(await screen.findByTestId(EmptyStateTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(EmptyStateKey)[0]).toMatchObject({
      title: 'No BPay batches available',
    });
  });

  test('renders the batch load error with retry when the list request fails', async () => {
    const error = new Error('Load failed');
    mockedBatchService.getBatchList.mockRejectedValue(error);

    render(<CreditorBPayPanel />);

    expect(await screen.findByText('Load failed')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Retry'}));
    await waitFor(() => expect(mockedToaster.showApiError).toHaveBeenCalledWith(error));
  });

  test('opens create mode and loads creditor bpay records after a creditor is selected', async () => {
    mockedBPayInfoService.getActiveByCreditorId.mockResolvedValue([
      {
        Seq: 1,
        CreditorID: 77,
        BPayBillerCode: '12345',
        BPayReference: 'REF-1',
        Notes: 'Invoice',
        IsActive: true,
      },
    ] as any);

    render(<CreditorBPayPanel />);

    await screen.findByTestId(EmptyStateTestId);
    await userEvent.click(screen.getByRole('button', {name: '+ New Batch'}));

    expect(screen.getByTestId(PopupModalTestId)).toBeInTheDocument();
    expect(screen.getByTestId(SynCreditorSelectorTestId)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: 'Pick Creditor'}));

    await waitFor(() => expect(mockedBPayInfoService.getActiveByCreditorId).toHaveBeenCalledWith(77));
    expect(ComponentTestHelper.get(SynCreditorSelectorKey).length).toBeGreaterThan(0);
  });

  test('renders the batch list table when persisted batches exist', async () => {
    mockedBatchService.getBatchList.mockResolvedValue({
      data: [
        {id: 'batch-1', isActive: true, createdAt: '2026-01-01T10:00:00Z', totalAmount: 0, generatedAt: null, comments: null, content: null},
      ],
    } as any);

    render(<CreditorBPayPanel />);

    expect(await screen.findByTestId(BPayBatchResultPanelTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(BPayBatchResultPanelKey)[0]).toMatchObject({
      batches: expect.arrayContaining([expect.objectContaining({id: 'batch-1'})]),
    });
  });
});
