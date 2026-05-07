import iAcaraData from "./iAcaraData";
import AcaraDataHelper from "./AcaraDataHelper";

const getInvalidRecordCount = (records: iAcaraData[]) => {
  return records.filter(record => AcaraDataHelper.hasInvalidRecord(record)).length;
};

const getWarningRowCount = (records: iAcaraData[]) => {
  return records.filter(record => AcaraDataHelper.hasWarningRecord(record)).length;
};

const getWarningOccurrenceCount = (records: iAcaraData[]) => {
  return records.reduce((total, record) => {
    return total + AcaraDataHelper.countWarningOccurrences(record);
  }, 0);
};

const getFilteredRecords = (
  records: iAcaraData[],
  showInvalidOnly: boolean,
  showWarningOnly: boolean
) => {
  const invalidCount = getInvalidRecordCount(records);
  const warningCount = getWarningRowCount(records);
  const isInvalidFilterActive = showInvalidOnly === true && invalidCount > 0;
  const isWarningFilterActive = showWarningOnly === true && warningCount > 0;

  if (isInvalidFilterActive !== true && isWarningFilterActive !== true) {
    return records;
  }

  return records.filter((record) => {
    const hasInvalid = AcaraDataHelper.hasInvalidRecord(record);
    const hasWarning = AcaraDataHelper.hasWarningRecord(record);

    return (
      (isInvalidFilterActive === true && hasInvalid) ||
      (isWarningFilterActive === true && hasWarning)
    );
  });
};

const AcaraDataPanelHelper = {
  getInvalidRecordCount,
  getWarningRowCount,
  getWarningOccurrenceCount,
  getFilteredRecords,
};

export default AcaraDataPanelHelper;
