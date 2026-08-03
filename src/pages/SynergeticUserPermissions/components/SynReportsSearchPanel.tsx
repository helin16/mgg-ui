import {useState} from 'react';
import {Button, InputGroup, Form} from 'react-bootstrap';
import SynReportsPermissionTable from './SynReportsPermissionTable';

type iSynReportsSearchPanel = {
  excludedUserIds?: number[];
};

const SynReportsSearchPanel = ({excludedUserIds = []}: iSynReportsSearchPanel) => {
  const [reportCode, setReportCode] = useState<string>('');
  const [searchedCode, setSearchedCode] = useState<string>('');

  const handleSearch = () => {
    if (reportCode.trim()) {
      setSearchedCode(reportCode.trim().toUpperCase());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <InputGroup className={'mt-3 mb-3'} style={{maxWidth: '400px'}}>
        <Form.Control
          placeholder={'Please type in the report code...'}
          value={reportCode}
          onChange={(e) => setReportCode(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant={'outline-secondary'}
          onClick={handleSearch}
        >
          Search
        </Button>
      </InputGroup>
      {searchedCode && (
        <SynReportsPermissionTable
          reportCode={searchedCode}
          excludedUserIds={excludedUserIds}
        />
      )}
    </div>
  );
};

export default SynReportsSearchPanel;
