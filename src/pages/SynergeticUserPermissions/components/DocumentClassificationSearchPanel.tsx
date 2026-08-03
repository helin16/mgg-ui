import {useState} from 'react';
import {Form} from 'react-bootstrap';
import DocumentClassificationPermissionsTable from './DocumentClassificationPermissionsTable';
import iSynLuDocumentClassification
  from '../../../types/Synergetic/Lookup/iSynLuDocumentClassification';

type iDocumentClassificationSearchPanel = {
  classifications: iSynLuDocumentClassification[];
  excludedUserIds?: number[];
};

const DocumentClassificationSearchPanel = ({
  classifications,
  excludedUserIds = [],
}: iDocumentClassificationSearchPanel) => {
  const [selectedCode, setSelectedCode] = useState<string>('');

  return (
    <div>
      <Form.Group className={'mt-3 mb-3'} style={{maxWidth: '400px'}}>
        <Form.Label>Select Classification</Form.Label>
        <Form.Select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
        >
          <option value="">-- Please select a classification --</option>
          {classifications.map(classification => (
            <option key={classification.Code} value={classification.Code}>
              {classification.Code} - {classification.Description}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      {selectedCode && (
        <DocumentClassificationPermissionsTable
          classificationCode={selectedCode}
          excludedUserIds={excludedUserIds}
        />
      )}
    </div>
  );
};

export default DocumentClassificationSearchPanel;
