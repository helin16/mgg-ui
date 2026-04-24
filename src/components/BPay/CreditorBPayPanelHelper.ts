import iCreditorBPayBatch from '../../types/BPay/iCreditorBPayBatch';
import iCreditorBPayBatchSection from '../../types/BPay/iCreditorBPayBatchSection';
import iCreditorBPayBatchSectionItem from '../../types/BPay/iCreditorBPayBatchSectionItem';
import iSynCreditorBPayInfo from '../../types/Synergetic/Finance/iSynCreditorBPayInfo';
import iSynVCreditor from '../../types/Synergetic/Finance/iSynVCreditor';
import MathHelper from '../../helper/MathHelper';

export const getBatchId = (batch?: iCreditorBPayBatch | null) => {
  return `${batch?.id || batch?.Id || ''}`.trim();
};

export const getPersistedBatches = (batches: iCreditorBPayBatch[] = []) => {
  return batches.filter(batch => getBatchId(batch) !== '' && batch?.isActive !== false);
};

export const getBatchSections = (batch?: iCreditorBPayBatch | null) => {
  const sections = batch?.Sections;
  if (Array.isArray(sections) && sections.length > 0) {
    return sections;
  }
  const contentSections = batch?.content?.sections;
  return Array.isArray(contentSections) ? contentSections : [];
};

export const getSectionId = (section?: iCreditorBPayBatchSection | null) => {
  return `${section?.id || section?.Id || ''}`.trim();
};

export const getSectionItems = (section?: iCreditorBPayBatchSection | null) => {
  const items = ((section as any)?.Items || (section as any)?.items || []) as iCreditorBPayBatchSectionItem[];
  return items.map(item => ({
    ...item,
    creditorName: item?.creditorName || section?.Creditor?.name || section?.customerName || section?.title || null,
    reference: item?.reference || (item as any)?.referenceNum || item?.reference1 || null,
  }));
};

export const getSectionCreditorId = (section?: iCreditorBPayBatchSection | null) => {
  if (!section) {
    return null;
  }
  if (section.Creditor?.id !== null && section.Creditor?.id !== undefined) {
    return Number(section.Creditor.id);
  }
  const firstItem = getSectionItems(section)[0];
  if (firstItem?.creditorId !== undefined && firstItem?.creditorId !== null) {
    return Number(firstItem.creditorId);
  }
  return null;
};

export const getBPayInfoBillerCode = (info?: iSynCreditorBPayInfo | null) => {
  return `${info?.BPayBillerCode || info?.BillerCode || ''}`.trim();
};

export const getBPayInfoReference = (info?: iSynCreditorBPayInfo | null) => {
  return `${info?.BPayReference || info?.ReferenceNum || ''}`.trim();
};

export const getBPayInfoComments = (info?: iSynCreditorBPayInfo | null) => {
  return `${info?.Notes || info?.Comments || ''}`.trim();
};

export const getActiveBPayInfos = (records: iSynCreditorBPayInfo[] = []) => {
  return records.filter(record => record.IsActive !== false);
};

export const getAutoSelectedBPayInfo = (records: iSynCreditorBPayInfo[] = []) => {
  return records.length === 1 ? records[0] : null;
};

export const parseAmountInput = (rawAmount: string) => {
  const trimmed = `${rawAmount || ''}`.trim();
  if (trimmed === '') {
    return {
      amount: null,
      error: 'Amount is required.',
    };
  }

  const amount = Number(trimmed);
  if (Number.isNaN(amount)) {
    return {
      amount: null,
      error: 'Amount must be a valid number.',
    };
  }

  if (amount <= 0) {
    return {
      amount: null,
      error: 'Amount must be greater than zero.',
    };
  }

  return {
    amount,
    error: null,
  };
};

export const getCurrentWorkingBatch = (batches: iCreditorBPayBatch[] = []) => {
  const persistedBatches = getPersistedBatches(batches);
  if (persistedBatches.length <= 0) {
    return null;
  }
  const unGenerated = persistedBatches.filter(batch => batch.generatedAt === null || `${batch.generatedAt || ''}`.trim() === '');
  return unGenerated.length > 0 ? unGenerated[0] : persistedBatches[0];
};

export const getBatchSectionCount = (batch?: iCreditorBPayBatch | null) => {
  return getBatchSections(batch).length;
};

export const getBatchItemCount = (batch?: iCreditorBPayBatch | null) => {
  return getBatchSections(batch).reduce((total, section) => {
    const items = getSectionItems(section);
    if (items.length > 0) {
      return MathHelper.add(total, items.length);
    }
    return MathHelper.add(total, Number(section.itemCount || 0));
  }, 0);
};

export const getBatchStatusLabel = (batch?: iCreditorBPayBatch | null) => {
  return batch?.generatedAt ? 'GENERATED' : 'NEW';
};

export const sortBatchesByCreatedDesc = (batches: iCreditorBPayBatch[] = []) => {
  return [...batches].sort((batch1, batch2) => {
    const time1 = batch1?.createdAt ? new Date(batch1.createdAt).getTime() : 0;
    const time2 = batch2?.createdAt ? new Date(batch2.createdAt).getTime() : 0;
    return time2 - time1;
  });
};

export const getUserFullName = (user?: {firstName?: string | null; lastName?: string | null} | null) => {
  return `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
};

export const hasUnsavedBatchEntry = ({
  selectedCreditor,
  selectedBPayInfo,
  amount,
}: {
  selectedCreditor?: iSynVCreditor | null;
  selectedBPayInfo?: iSynCreditorBPayInfo | null;
  amount?: string | null;
}) => {
  const hasSelectedCreditor = selectedCreditor !== null && selectedCreditor !== undefined;
  const hasSelectedBPayInfo = selectedBPayInfo !== null && selectedBPayInfo !== undefined;
  const hasAmount = `${amount || ''}`.trim() !== '';
  return hasSelectedCreditor || hasSelectedBPayInfo || hasAmount;
};

export const shouldDisableNewBatchAction = (isLoadingBatches = false, hasBatchLoadError = false) => {
  return isLoadingBatches || hasBatchLoadError;
};

export const matchSectionToCreditor = (
  section: iCreditorBPayBatchSection,
  creditor: iSynVCreditor
) => {
  const sectionCreditorId = getSectionCreditorId(section);
  if (sectionCreditorId !== null) {
    return sectionCreditorId === creditor.CreditorID;
  }

  const expectedNames = [
    `${creditor.CreditorNameExternal || ''}`.trim().toLowerCase(),
    `${creditor.CreditorNameInternal || ''}`.trim().toLowerCase(),
  ].filter(Boolean);

  const sectionNames = [
    `${section.customerName || ''}`.trim().toLowerCase(),
    `${section.title || ''}`.trim().toLowerCase(),
  ].filter(Boolean);

  return sectionNames.some(name => expectedNames.includes(name));
};

export const findExistingSectionForCreditor = (
  sections: iCreditorBPayBatchSection[] = [],
  creditor: iSynVCreditor
) => {
  return sections.find(section => matchSectionToCreditor(section, creditor)) || null;
};

export const buildCreateBatchPayload = (amount: number) => {
  return {
    totalAmount: amount,
    generatedAt: null,
    comments: null,
    content: null,
  };
};

export const buildCreateSectionPayload = (
  batch: iCreditorBPayBatch,
  creditor: iSynVCreditor,
  amount: number
) => {
  return {
    batchId: getBatchId(batch),
    customerName: creditor.CreditorNameExternal,
    title: creditor.CreditorNameExternal,
    date: new Date().toISOString(),
    totalAmount: amount,
    totalAmt: amount,
    itemCount: 1,
    Creditor: {
      id: creditor.CreditorID,
      name: creditor.CreditorNameExternal,
    },
  };
};

export const buildCreateSectionItemPayload = (
  section: iCreditorBPayBatchSection,
  creditor: iSynVCreditor,
  info: iSynCreditorBPayInfo,
  amount: number
) => {
  const reference = getBPayInfoReference(info);
  const comments = getBPayInfoComments(info);
  return {
    sectionId: getSectionId(section),
    creditorId: creditor.CreditorID,
    amount,
    amt: amount,
    billerCode: getBPayInfoBillerCode(info),
    reference,
    reference1: reference,
    reference2: null,
    reference3: null,
    creditorName: creditor.CreditorNameExternal,
    description: comments || null,
    comments: comments || null,
    payerBankBSB: creditor.CreditorBankBSB,
    payerBankAcc: creditor.CreditorBankAccount,
    dueDate: null,
  };
};

export const buildLodgementReferencesFromCreditorName = (creditorName?: string | null) => {
  const normalizedCreditorName = `${creditorName || ''}`.replace(/\s+/g, ' ').trim();
  return {
    reference1: normalizedCreditorName.slice(0, 10) || null,
    reference2: normalizedCreditorName.slice(10, 30) || null,
    reference3: normalizedCreditorName.slice(30, 80) || null,
  };
};

export const calculateSectionTotal = (section?: iCreditorBPayBatchSection | null) => {
  const items = getSectionItems(section);
  if (items.length <= 0) {
    return Number(section?.totalAmount || section?.totalAmt || 0);
  }
  return items.reduce((total, item) => MathHelper.add(total, Number(item.amount || item.amt || 0)), 0);
};

export const calculateBatchTotal = (batch?: iCreditorBPayBatch | null) => {
  const sections = batch?.Sections || [];
  if (sections.length <= 0) {
    return Number(batch?.totalAmount || 0);
  }
  return sections.reduce((total, section) => MathHelper.add(total, calculateSectionTotal(section)), 0);
};

export const appendItemToBatch = (
  batch: iCreditorBPayBatch,
  section: iCreditorBPayBatchSection,
  item: iCreditorBPayBatchSectionItem
) => {
  const sections = batch.Sections || [];
  const sectionId = getSectionId(section);
  const updatedSections = sections.map(existingSection => {
    if (getSectionId(existingSection) !== sectionId) {
      return existingSection;
    }

    const items = [...getSectionItems(existingSection), item];
    return {
      ...existingSection,
      Items: items,
      itemCount: items.length,
      totalAmount: calculateSectionTotal({
        ...existingSection,
        Items: items,
      }),
      totalAmt: calculateSectionTotal({
        ...existingSection,
        Items: items,
      }),
    };
  });

  const sectionExists = updatedSections.some(existingSection => getSectionId(existingSection) === sectionId);
  const finalSections = sectionExists
    ? updatedSections
    : [
        ...updatedSections,
        {
          ...section,
          Items: [item],
          itemCount: 1,
          totalAmount: Number(item.amount || item.amt || 0),
          totalAmt: Number(item.amount || item.amt || 0),
        },
      ];

  const updatedBatch = {
    ...batch,
    Sections: finalSections,
  };

  return {
    ...updatedBatch,
    totalAmount: calculateBatchTotal(updatedBatch),
  };
};

export const removeItemFromBatch = (
  batch: iCreditorBPayBatch,
  section: iCreditorBPayBatchSection,
  item: iCreditorBPayBatchSectionItem
) => {
  const sectionId = getSectionId(section);
  const itemId = `${item?.id || item?.Id || ''}`.trim();

  const remainingSections = (batch.Sections || []).reduce((sections: iCreditorBPayBatchSection[], existingSection) => {
    if (getSectionId(existingSection) !== sectionId) {
      return [...sections, existingSection];
    }

    const remainingItems = getSectionItems(existingSection).filter(existingItem => {
      const existingItemId = `${existingItem?.id || existingItem?.Id || ''}`.trim();
      return existingItemId !== itemId;
    });

    if (remainingItems.length <= 0) {
      return sections;
    }

    return [
      ...sections,
      {
        ...existingSection,
        Items: remainingItems,
        itemCount: remainingItems.length,
        totalAmount: calculateSectionTotal({
          ...existingSection,
          Items: remainingItems,
        }),
        totalAmt: calculateSectionTotal({
          ...existingSection,
          Items: remainingItems,
        }),
      },
    ];
  }, []);

  const nextBatch = {
    ...batch,
    Sections: remainingSections,
  };

  return {
    ...nextBatch,
    totalAmount: remainingSections.length <= 0 ? 0 : calculateBatchTotal(nextBatch),
  };
};
