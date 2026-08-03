import {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import SectionDiv from '../../../components/common/SectionDiv';
import Table, {iTableColumn} from '../../../components/common/Table';
import ModuleEditPanel from '../../../components/module/ModuleEditPanel';
import SynLuDocumentClassificationSelector
  from '../../../components/Synergetic/SynLuDocumentClassificationSelector';
import iModule from '../../../types/modules/iModule';
import {MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import {iAutoCompleteSingle} from '../../../components/common/AutoComplete';
import SynConfigUserSelector from '../../../components/Synergetic/SynConfigUserSelector';

type iSettingsEditor = {
  module: iModule;
  onUpdate: (settings: any) => void;
};

const SettingsEditor = ({module, onUpdate}: iSettingsEditor) => {
  const [documentClassificationCodes, setDocumentClassificationCodes] = useState<string[]>(
    module.settings?.documentClassificationCodes || []
  );
  const [excludedUserIds, setExcludedUserIds] = useState<number[]>(
    module.settings?.excludedUserIds || []
  );
  const [reportCodes, setReportCodes] = useState<string[]>(
    module.settings?.reportCodes || []
  );

  const saveReportCodes = (codes: string[]) => {
    setReportCodes(codes);
    onUpdate({
      ...(module.settings || {}),
      documentClassificationCodes,
      reportCodes: Array.from(new Set(codes.map(code => code.trim()).filter(Boolean))),
      excludedUserIds,
    });
  };

  const reportColumns: iTableColumn<{Code: string; Index: number}>[] = [
    {
      key: 'Code',
      header: 'Report Code',
      cell: (column, row) => (
        <td key={column.key}>
          <Form.Control
            value={row.Code}
            placeholder={'Enter report code'}
            onChange={event => saveReportCodes(reportCodes.map((code, index) =>
              index === row.Index ? event.target.value : code
            ))}
          />
        </td>
      ),
    },
    {
      key: 'Actions',
      header: '',
      cell: (column, row) => (
        <td key={column.key} className={'text-end'}>
          <Button
            variant={'outline-danger'}
            size={'sm'}
            aria-label={`Remove report ${row.Code || row.Index + 1}`}
            onClick={() => saveReportCodes(reportCodes.filter((_, index) => index !== row.Index))}
          >
            <Icons.Trash />
          </Button>
        </td>
      ),
    },
  ];

  const updateClassifications = (selection: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => {
    const selectedOptions = Array.isArray(selection) ? selection : selection ? [selection] : [];
    const codes = selectedOptions.map(option => `${option.value}`);
    setDocumentClassificationCodes(codes);
    onUpdate({
      ...(module.settings || {}),
      documentClassificationCodes: codes,
      reportCodes: Array.from(new Set(reportCodes.map(code => code.trim()).filter(Boolean))),
      excludedUserIds,
    });
  };

  const updateExcludedUsers = (selection: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => {
    const selectedOptions = Array.isArray(selection) ? selection : selection ? [selection] : [];
    const userIds = selectedOptions.map(option => Number(option.value));
    setExcludedUserIds(userIds);
    onUpdate({
      ...(module.settings || {}),
      documentClassificationCodes,
      reportCodes: Array.from(new Set(reportCodes.map(code => code.trim()).filter(Boolean))),
      excludedUserIds: userIds,
    });
  };

  return (
    <SectionDiv>
      <h5>Document Classifications</h5>
      <Form.Label>
        Select the document classifications that users can display.
      </Form.Label>
      <SynLuDocumentClassificationSelector
        values={documentClassificationCodes}
        onSelect={updateClassifications}
        isMulti
        allowClear
      />
      <SectionDiv>
        <h5>Reports</h5>
        <Form.Label>
          Enter the Synergetic report codes that users can review.
        </Form.Label>
        <Table
          columns={reportColumns}
          rows={reportCodes.map((Code, Index) => ({Code, Index}))}
          responsive
          size={'sm'}
        />
        <Button variant={'outline-primary'} size={'sm'} onClick={() => saveReportCodes([...reportCodes, ''])}>
          <Icons.PlusLg /> Add Report
        </Button>
      </SectionDiv>
      <SectionDiv>
        <h5>Excluded Users</h5>
        <Form.Label>
          Select users who should not appear in the document classification permission tables.
        </Form.Label>
        <SynConfigUserSelector
          values={excludedUserIds}
          onSelect={updateExcludedUsers}
          isMulti
          allowClear
        />
      </SectionDiv>
    </SectionDiv>
  );
};

const SynergeticUserPermissionsSettings = () => {
  const [settings, setSettings] = useState<any>({});

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS}
      roleId={ROLE_ID_ADMIN}
      getChildren={module => <SettingsEditor module={module} onUpdate={setSettings} />}
      getSubmitData={() => settings}
    />
  );
};

export {SettingsEditor};
export default SynergeticUserPermissionsSettings;
