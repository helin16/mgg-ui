import styled from 'styled-components';
import ExplanationPanel from '../ExplanationPanel';
import SynCreditorSelector from '../synCreditor/SynCreditorSelector';
import iSynVCreditor from '../../types/Synergetic/Finance/iSynVCreditor';
import iSynCreditorBPayInfo from '../../types/Synergetic/Finance/iSynCreditorBPayInfo';
import {iAutoCompleteSingle} from '../common/AutoComplete';
import {Alert, Button, Col, FormGroup, Row, Spinner} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import SynCreditorBPayInfoService from '../../services/Synergetic/Finance/SynCreditorBPayInfoService';
import SynVCreditorService from '../../services/Synergetic/Finance/SynVCreditorService';
import Toaster, {TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS} from '../../services/Toaster';
import FormLabel from '../form/FormLabel';
import FormErrorDisplay, {iErrorMap} from '../form/FormErrorDisplay';
import BPayInfoSelectionTable from './BPayInfoSelectionTable';
import EmptyState from '../common/EmptyState';
import PopupModal from '../common/PopupModal';
import CreditorBPayBatchService from '../../services/BPay/CreditorBPayBatchService';
import iCreditorBPayBatch from '../../types/BPay/iCreditorBPayBatch';
import iCreditorBPayBatchSection from '../../types/BPay/iCreditorBPayBatchSection';
import iCreditorBPayBatchSectionItem from '../../types/BPay/iCreditorBPayBatchSectionItem';
import BPayBatchResultPanel from './BPayBatchResultPanel';
import {
  appendItemToBatch,
  buildCreateSectionItemPayload,
  calculateBatchTotal,
  findExistingSectionForCreditor,
  getActiveBPayInfos,
  getPersistedBatches,
  parseAmountInput,
  removeItemFromBatch,
  sortBatchesByCreatedDesc,
  shouldDisableNewBatchAction
} from './CreditorBPayPanelHelper';

const Wrapper = styled.div`
  .panel {
    background-color: #fff;
    border: 1px solid #d9dee5;
    border-radius: 0.4rem;
    padding: 1rem;
  }

  .panel-title {
    margin-bottom: 1rem;

    &.no-margin,
    &.no-margin h4,
    &.no-margin p {
      margin: 0;
    }
  }

  .panel-header {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .list-panel {
    padding: 0;
    border: 0;
    background: transparent;
  }
`;

const createTempId = (prefix: string) => `${prefix}-${Date.now()}-${Math.round(Math.random() * 100000)}`;
const hasDraftBatchItems = (batch?: iCreditorBPayBatch | null) => {
  return (batch?.Sections || []).some(section => (section.Items || []).length > 0);
};
const isGeneratedBatch = (batch?: iCreditorBPayBatch | null) => Boolean(batch?.generatedAt);
const getBatchDownloadFileName = (batch?: iCreditorBPayBatch | null) => {
  const sourceDate = batch?.generatedAt || batch?.updatedAt || batch?.createdAt || new Date().toISOString();
  const parsedDate = new Date(sourceDate);
  const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const datePart = `${safeDate.getFullYear()}${`${safeDate.getMonth() + 1}`.padStart(2, '0')}${`${safeDate.getDate()}`.padStart(2, '0')}`;
  const timePart = `${`${safeDate.getHours()}`.padStart(2, '0')}${`${safeDate.getMinutes()}`.padStart(2, '0')}${`${safeDate.getSeconds()}`.padStart(2, '0')}`;
  return `NAB_BPAY_${datePart}_${timePart}.bpb`;
};
const normalizeStoredBatchSections = (batch?: iCreditorBPayBatch | null): iCreditorBPayBatchSection[] => {
  const contentSections = Array.isArray(batch?.content?.sections) ? batch?.content?.sections : [];
  return contentSections.map((section: any, sectionIndex: number) => ({
    id: `${section?.id || section?.Id || `content-section-${sectionIndex}`}`,
    Id: section?.Id,
    batchId: Number(section?.batchId || 0),
    totalAmt: section?.totalAmt ?? section?.totalAmount ?? 0,
    customerName: section?.customerName || section?.Creditor?.name || null,
    date: section?.date || null,
    title: section?.title || section?.customerName || section?.Creditor?.name || '',
    totalAmount: section?.totalAmount ?? 0,
    itemCount: section?.itemCount ?? ((section?.Items || section?.items || []).length || 0),
    Creditor: section?.Creditor || null,
    Items: ((section?.Items || section?.items || []) as any[]).map((item: any, itemIndex: number) => ({
      ...item,
      id: item?.id || item?.Id || `content-item-${sectionIndex}-${itemIndex}`,
      sectionId: Number(item?.sectionId || 0),
      amount: Number(item?.amount || item?.amt || 0),
      amt: Number(item?.amt || item?.amount || 0),
      reference: item?.reference || item?.referenceNum || item?.reference1 || null,
      reference1: item?.reference1 || item?.referenceNum || item?.reference || null,
      creditorName: item?.creditorName || section?.Creditor?.name || section?.customerName || null,
    })),
  }));
};
const getBatchCreditorId = (batch?: iCreditorBPayBatch | null) => {
  const sections = batch?.Sections || [];
  for (const section of sections) {
    if (section?.Creditor?.id !== null && section?.Creditor?.id !== undefined) {
      return Number(section.Creditor.id);
    }
    const firstItem = (section?.Items || [])[0];
    if (firstItem?.creditorId !== null && firstItem?.creditorId !== undefined) {
      return Number(firstItem.creditorId);
    }
  }
  return 0;
};

const CreditorBPayPanel = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [batches, setBatches] = useState<iCreditorBPayBatch[]>([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(true);
  const [batchLoadError, setBatchLoadError] = useState<string | null>(null);
  const [selectedCreditor, setSelectedCreditor] = useState<iSynVCreditor | null>(null);
  const [bPayInfos, setBPayInfos] = useState<iSynCreditorBPayInfo[]>([]);
  const [amountByBPayInfoSeq, setAmountByBPayInfoSeq] = useState<{[key: number]: string}>({});
  const [errors, setErrors] = useState<iErrorMap>({});
  const [isLoadingInfos, setIsLoadingInfos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingModalBatch, setIsLoadingModalBatch] = useState(false);
  const [modalContentKey, setModalContentKey] = useState(0);
  const [workingBatch, setWorkingBatch] = useState<iCreditorBPayBatch | null>(null);
  const [editingBatch, setEditingBatch] = useState<iCreditorBPayBatch | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeBatchActionId, setActiveBatchActionId] = useState<string | null>(null);

  const getBatchWithDetails = async (batch: iCreditorBPayBatch) => {
    return {
      ...batch,
      Sections: normalizeStoredBatchSections(batch),
    };
  };

  const createDraftBatch = (): iCreditorBPayBatch => ({
    id: createTempId('batch'),
    isActive: true,
    createdAt: new Date().toISOString(),
    createdById: '',
    updatedAt: new Date().toISOString(),
    updatedById: '',
    totalAmount: 0,
    generatedAt: null,
    comments: null,
    content: null,
    Sections: [],
  });

  const createDraftSection = (creditor: iSynVCreditor, amount: number): iCreditorBPayBatchSection => ({
    id: createTempId(`section-${creditor.CreditorID}`),
    isActive: true,
    createdAt: new Date().toISOString(),
    createdById: '',
    updatedAt: new Date().toISOString(),
    updatedById: '',
    batchId: 0,
    customerName: creditor.CreditorNameExternal,
    date: new Date().toISOString(),
    title: creditor.CreditorNameExternal,
    totalAmount: amount,
    itemCount: 1,
    Creditor: {
      id: creditor.CreditorID,
      name: creditor.CreditorNameExternal,
    },
    Items: [],
  });

  const createDraftItem = (
    creditor: iSynVCreditor,
    info: iSynCreditorBPayInfo,
    amount: number
  ): iCreditorBPayBatchSectionItem => {
    const payload = buildCreateSectionItemPayload({id: createTempId('section-ref')} as iCreditorBPayBatchSection, creditor, info, amount);
    return {
      id: createTempId(`item-${info.Seq}`),
      isActive: true,
      createdAt: new Date().toISOString(),
      createdById: '',
      updatedAt: new Date().toISOString(),
      updatedById: '',
      sectionId: 0,
      creditorId: creditor.CreditorID,
      amount,
      amt: amount,
      reference: payload.reference,
      reference1: payload.reference1,
      reference2: payload.reference2 || undefined,
      reference3: payload.reference3 || undefined,
      billerCode: payload.billerCode,
      creditorName: payload.creditorName,
      description: payload.description,
      comments: payload.comments,
      payerBankBSB: payload.payerBankBSB,
      payerBankAcc: payload.payerBankAcc,
      dueDate: payload.dueDate,
    };
  };

  const loadBatches = async (showErrorToast = false) => {
    setIsLoadingBatches(true);
    setBatchLoadError(null);
    try {
      const response = await CreditorBPayBatchService.getBatchList();
      const persistedBatches = getPersistedBatches(response.data || []);
      const hydratedBatches = await Promise.all(persistedBatches.map(batch => getBatchWithDetails(batch)));
      setBatches(sortBatchesByCreatedDesc(hydratedBatches as iCreditorBPayBatch[]));
    } catch (err: any) {
      setBatches([]);
      const errorMessage = err?.response?.data?.message || err?.message || 'Unable to load BPay batches.';
      setBatchLoadError(errorMessage);
      if (showErrorToast) {
        Toaster.showApiError(err);
      }
    } finally {
      setIsLoadingBatches(false);
    }
  };

  useEffect(() => {
    void loadBatches();
  }, []);

  useEffect(() => {
    if (selectedCreditor === null) {
      setBPayInfos([]);
      return;
    }
    let isCanceled = false;
    setIsLoadingInfos(true);
    setSuccessMessage(null);
    SynCreditorBPayInfoService.getActiveByCreditorId(selectedCreditor.CreditorID)
      .then(records => {
        if (isCanceled) {
          return;
        }
        const activeRecords = getActiveBPayInfos(records);
        setBPayInfos(activeRecords);
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        setBPayInfos([]);
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoadingInfos(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [selectedCreditor]);

  const resetDraftState = () => {
    setSelectedCreditor(null);
    setBPayInfos([]);
    setAmountByBPayInfoSeq({});
    setErrors({});
    setWorkingBatch(null);
    setEditingBatch(null);
    setSuccessMessage(null);
    setModalContentKey(prev => prev + 1);
  };

  const getCreditorById = async (creditorId?: number | null) => {
    if (!creditorId) {
      return null;
    }
    const response = await SynVCreditorService.getAll({
      where: JSON.stringify({CreditorID: creditorId}),
    });
    return response.data?.[0] || null;
  };

  const onCreditorSelected = (option: iAutoCompleteSingle | null) => {
    setSelectedCreditor(option?.data || null);
    setBPayInfos([]);
    setAmountByBPayInfoSeq({});
    setErrors({});
  };

  const validate = (selectedRecord: iSynCreditorBPayInfo | null, rawAmount: string) => {
    const newErrors: iErrorMap = {};
    if (selectedCreditor === null) {
      newErrors.creditor = 'Creditor is required.';
    }
    if (selectedRecord === null) {
      newErrors.bPayInfo = 'A BPay record must be selected.';
    }
    const amountCheck = parseAmountInput(rawAmount);
    if (amountCheck.error) {
      newErrors.amount = amountCheck.error;
    }
    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      amount: amountCheck.amount,
    };
  };

  const downloadBatchAgain = async (batch: iCreditorBPayBatch) => {
    const batchId = `${batch.id || batch.Id || ''}`.trim();
    if (batchId === '') {
      return;
    }

    setActiveBatchActionId(batchId);
    try {
      const latestBatch = await CreditorBPayBatchService.get(batchId);
      const content = latestBatch?.content?.generatedFileContent || latestBatch?.content;
      if (!content) {
        Toaster.showToast('No generated file content was found for this batch.', TOAST_TYPE_ERROR);
        return;
      }

      const blob = typeof content === 'string'
        ? new Blob([content], {type: 'text/plain;charset=utf-8'})
        : new Blob([new Uint8Array(content.data || content)], {type: 'application/octet-stream'});
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = getBatchDownloadFileName(latestBatch || batch);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      Toaster.showApiError(err);
    } finally {
      setActiveBatchActionId(null);
    }
  };

  const deleteBatch = async (batch: iCreditorBPayBatch) => {
    const batchId = `${batch.id || batch.Id || ''}`.trim();
    if (batchId === '') {
      return;
    }

    setActiveBatchActionId(batchId);
    try {
      await CreditorBPayBatchService.deactivate(batchId);
      if (workingBatch && `${workingBatch.id || workingBatch.Id || ''}`.trim() === batchId) {
        setWorkingBatch(null);
      }
      await loadBatches();
      Toaster.showToast('BPay batch deleted successfully.', TOAST_TYPE_SUCCESS);
    } finally {
      setActiveBatchActionId(null);
    }
  };

  const handleAmountChanged = (record: iSynCreditorBPayInfo, value: string) => {
    const seq = record?.Seq || 0;
    setAmountByBPayInfoSeq(prev => ({
      ...prev,
      [seq]: value,
    }));
  };

  const handleAdd = async (selectedRecord: iSynCreditorBPayInfo) => {
    const amountValue = amountByBPayInfoSeq[selectedRecord?.Seq || 0] || '';
    const {isValid, amount: parsedAmount} = validate(selectedRecord, amountValue);
    if (!isValid || parsedAmount === null || selectedCreditor === null) {
      Toaster.showToast('Please fix the errors in the form before adding the BPay item.', TOAST_TYPE_ERROR);
      return;
    }

    setSuccessMessage(null);
    try {
      const currentDraftBatch = workingBatch || createDraftBatch();
      let existingSection = findExistingSectionForCreditor(currentDraftBatch.Sections || [], selectedCreditor);
      if (existingSection === null) {
        existingSection = createDraftSection(selectedCreditor, parsedAmount);
      }

      const draftItem = createDraftItem(selectedCreditor, selectedRecord, parsedAmount);
      const nextBatch = appendItemToBatch(
        {
          ...currentDraftBatch,
          Sections: currentDraftBatch.Sections || [],
        },
        existingSection,
        draftItem
      );
      setWorkingBatch(nextBatch);
      setAmountByBPayInfoSeq(prev => ({
        ...prev,
        [selectedRecord?.Seq || 0]: '',
      }));
      setErrors({});
    } catch (err) {
      Toaster.showApiError(err);
    }
  };

  const handleDeleteDraftItem = (
    batch: iCreditorBPayBatch,
    section: iCreditorBPayBatchSection,
    item: iCreditorBPayBatchSectionItem
  ) => {
    const nextBatch = removeItemFromBatch(batch, section, item);
    setWorkingBatch((nextBatch.Sections || []).length > 0 ? nextBatch : null);
  };

  const buildBatchPayload = (generateFile: boolean) => {
    const resolvedCreditorId = Number(
      selectedCreditor?.CreditorID
      || getBatchCreditorId(workingBatch)
      || 0
    );
    return {
      totalAmount: calculateBatchTotal(workingBatch),
      generatedAt: null,
      generatedById: null,
      comments: workingBatch?.comments || null,
      content: null,
      generateFile,
      sections: (workingBatch?.Sections || []).map(draftSection => ({
        totalAmount: Number(draftSection.totalAmount || 0),
        customerName: draftSection.customerName || draftSection.title || draftSection.Creditor?.name || selectedCreditor?.CreditorNameExternal || '',
        Creditor: draftSection.Creditor || null,
        date: draftSection.date || new Date().toISOString(),
        items: (draftSection.Items || []).map(draftItem => ({
          creditorId: Number(draftItem.creditorId),
          billerCode: draftItem.billerCode || null,
          referenceNum: draftItem.reference || draftItem.reference1 || null,
          payerBankBSB: draftItem.payerBankBSB || null,
          payerBankAcc: draftItem.payerBankAcc || null,
          reference1: draftItem.reference1 || null,
          reference2: draftItem.reference2 || null,
          reference3: draftItem.reference3 || null,
          amount: Number(draftItem.amount || draftItem.amt || 0),
          comments: draftItem.comments || draftItem.description || null,
        })),
      })),
    };
  };

  const submitDraftBatch = async (generateFile: boolean) => {
    if (!workingBatch || (workingBatch.Sections || []).length <= 0) {
      Toaster.showToast('Add at least one BPay item before saving.', TOAST_TYPE_ERROR);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildBatchPayload(generateFile);
      const editingBatchId = `${editingBatch?.id || editingBatch?.Id || ''}`.trim();
      const response = editingBatchId === ''
        ? await CreditorBPayBatchService.create(payload)
        : await CreditorBPayBatchService.update(editingBatchId, payload);

      await loadBatches();
      Toaster.showToast(
        generateFile ? 'BPay batch generated successfully.' : 'BPay batch saved successfully.',
        TOAST_TYPE_SUCCESS
      );
      if (generateFile && response?.content) {
        await downloadBatchAgain(response);
      }
      resetDraftState();
      setIsCreateModalOpen(false);
    } catch (err) {
      Toaster.showApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => submitDraftBatch(false);

  const handleSaveAndGenerateDraft = async () => submitDraftBatch(true);

  const openExistingBatch = async (batch: iCreditorBPayBatch) => {
    setIsLoadingModalBatch(true);
    setSuccessMessage(null);
    setErrors({});
    setAmountByBPayInfoSeq({});
    setIsCreateModalOpen(true);
    try {
      const hydratedBatch = await getBatchWithDetails(batch);
      if (!hydratedBatch) {
        return;
      }
      setEditingBatch(hydratedBatch);
      setWorkingBatch(hydratedBatch);
      setSelectedCreditor(null);
    } catch (err) {
      Toaster.showApiError(err);
      setIsCreateModalOpen(false);
      resetDraftState();
    } finally {
      setIsLoadingModalBatch(false);
    }
  };

  const openCreateMode = () => {
    resetDraftState();
    setIsCreateModalOpen(true);
  };

  const handleCancel = async () => {
    resetDraftState();
    setIsCreateModalOpen(false);
    await loadBatches();
  };

  const renderBPayInfoState = () => {
    if (isGeneratedBatch(editingBatch)) {
      return null;
    }

    if (selectedCreditor === null) {
      return null;
    }

    if (isLoadingInfos) {
      return <Spinner animation={'border'} />;
    }

    if (bPayInfos.length <= 0) {
      return (
        <Alert variant={'warning'}>
          No active BPay records were found for the selected creditor. Choose a different creditor or review the creditor setup.
        </Alert>
      );
    }

    return (
      <>
        <BPayInfoSelectionTable
          amountByRecordSeq={amountByBPayInfoSeq}
          isSubmitting={isSubmitting}
          onAdd={handleAdd}
          onAmountChange={handleAmountChanged}
          isLoading={isLoadingInfos}
          records={bPayInfos}
        />
      </>
    );
  };

  const renderCreateModalBody = () => {
    if (isLoadingModalBatch) {
      return (
        <div className={'text-center py-4'}>
          <Spinner animation={'border'} />
        </div>
      );
    }

    const shouldShowEntryPanel = !isGeneratedBatch(editingBatch);

    return (
      <>
        {shouldShowEntryPanel ? (
          <div className={'panel'}>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <FormLabel label={'Creditor'} isRequired />
                  <SynCreditorSelector
                    allowClear
                    key={`creditor-selector-${modalContentKey}`}
                    onSelect={option => onCreditorSelected(option as iAutoCompleteSingle | null)}
                    value={selectedCreditor?.CreditorID || null}
                  />
                  <FormErrorDisplay errorsMap={errors} fieldName={'creditor'} />
                </FormGroup>
              </Col>
            </Row>

            <div className={'mt-3'}>
              {renderBPayInfoState()}
            </div>
          </div>
        ) : null}
        {workingBatch ? (
          <div className={'mt-3'}>
            <BPayBatchResultPanel
              batch={workingBatch}
              onDeleteBatchItem={isGeneratedBatch(editingBatch) ? undefined : handleDeleteDraftItem}
              successMessage={successMessage}
            />
          </div>
        ) : successMessage ? (
          <div className={'mt-3'}>
            <BPayBatchResultPanel batch={workingBatch} successMessage={successMessage} />
          </div>
        ) : null}
      </>
    );
  };

  const renderBatchListState = () => {
    if (isLoadingBatches) {
      return (
        <div className={'text-center py-4'}>
          <Spinner animation={'border'} />
        </div>
      );
    }

    if (batchLoadError) {
      return (
        <Alert variant={'danger'}>
          <div className={'mb-2'}>{batchLoadError}</div>
          <Button onClick={() => loadBatches(true)} size={'sm'} variant={'outline-danger'}>
            Retry
          </Button>
        </Alert>
      );
    }

    if (batches.length <= 0) {
      return (
        <EmptyState
          hideLogo
          title={'No BPay batches available'}
          description={'Create a new batch to begin batching creditor payments.'}
        />
      );
    }

    return (
      <BPayBatchResultPanel
        activeBatchActionId={activeBatchActionId}
        batches={batches}
        onDeleteBatch={deleteBatch}
        onDownloadBatch={downloadBatchAgain}
        onOpenBatch={openExistingBatch}
      />
    );
  };

  return (
    <Wrapper>
      <ExplanationPanel variant={'info'} text={<>This tools is designed to create BPay Batch File (.bpb) file, based on <a href={'https://mentonegirls.atlassian.net/wiki/spaces/IP/pages/1713078273/Bpay+Batch+Processing'}>Instructions</a></>} />
      <div className={'list-panel mt-3'}>
        <div className={'panel-header'}>
          <div className={'panel-title no-margin'}>
            <h4>BPay Batches</h4>
            <p>Review existing BPay batches before starting a new batch entry.</p>
          </div>
          <Button
            disabled={shouldDisableNewBatchAction(isLoadingBatches, batchLoadError !== null)}
            onClick={openCreateMode}
            variant={'primary'}
          >
            + New Batch
          </Button>
        </div>
        {renderBatchListState()}
      </div>
      <PopupModal
        dialogClassName={'modal-lg'}
        footer={(
          <>
            <Button disabled={isSubmitting} onClick={handleCancel} variant={'outline-secondary'}>
              Cancel
            </Button>
            {isGeneratedBatch(editingBatch) ? (
              <Button disabled={isSubmitting || !workingBatch} onClick={handleSaveAndGenerateDraft} variant={'primary'}>
                Download
              </Button>
            ) : (
              <>
                <Button disabled={isSubmitting || !hasDraftBatchItems(workingBatch)} onClick={handleSaveDraft} variant={'outline-primary'}>
                  Save
                </Button>
                <Button disabled={isSubmitting || !hasDraftBatchItems(workingBatch)} onClick={handleSaveAndGenerateDraft} variant={'primary'}>
                  Save & Generate
                </Button>
              </>
            )}
          </>
        )}
        handleClose={handleCancel}
        header={(
          <div className={'panel-title no-margin'}>
            <h4 className={'no-margin'}>BPay Batch Entry</h4>
            <p className={'no-margin'}>Total Amount: <b>${calculateBatchTotal(workingBatch).toFixed(2)}</b></p>
          </div>
        )}
        show={isCreateModalOpen}
      >
        {renderCreateModalBody()}
      </PopupModal>
    </Wrapper>
  )
}

export default CreditorBPayPanel
