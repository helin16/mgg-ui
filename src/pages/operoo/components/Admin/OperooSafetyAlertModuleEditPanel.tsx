import {MODULE_ID_OPEROO_SAFETY_ALERTS} from '../../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../../types/modules/iRole';
import ModuleEditPanel from '../../../../components/module/ModuleEditPanel';
import React, {useState} from 'react';
import iModule from '../../../../types/modules/iModule';
import {Form} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import styled from 'styled-components';

const operooApiTokenGeneratePageUrl = 'https://groups.operoo.com/admin/groups/32996/api_settings';

type iOperooSafetyAlertModuleEditPanelContent = {
  module: iModule;
  onUpdate: (data: any) => void;
}

const INPUT_TYPE_PASSWORD = 'password';
const INPUT_TYPE_TEXT = 'text';

const Wrapper = styled.div`
  .input-type-chg-btn {
    border: 1px solid #ced4da;
    background-color: white;
    color: #ced4da;
    border-left: none;
    outline: none;
  }
`;
const OperooSafetyAlertModuleEditPanelContent = ({module, onUpdate}: iOperooSafetyAlertModuleEditPanelContent) => {
  const [apiToken, setApiToken] = useState<string | undefined>(undefined);
  const [inputType, setInputType] = useState(INPUT_TYPE_PASSWORD);

  return (
    <Wrapper>
      <Form.Group controlId="apiToken">
        <Form.Label>
          Operoo API Token, can be generated from {' '}
          <a href={operooApiTokenGeneratePageUrl} target={'__BLANK'}>Operoo API Token Generate Page</a>
        </Form.Label>
        <InputGroup>
          <Form.Control
            placeholder="Paste your newly generated API token here."
            type={inputType}
            defaultValue={module.settings?.apiToken || ''}
            onChange={(event) => setApiToken(event.target.value)}
            onBlur={() => onUpdate(apiToken)}
          />
          <Button
            className={'input-type-chg-btn'}
            // variant="outline-secondary"
            onClick={() => setInputType(inputType === INPUT_TYPE_PASSWORD ? INPUT_TYPE_TEXT : INPUT_TYPE_PASSWORD)}
            >
            {inputType === INPUT_TYPE_PASSWORD ? <Eye /> : <EyeSlash />}
          </Button>
        </InputGroup>
      </Form.Group>
    </Wrapper>
  )
}

const OperooSafetyAlertModuleEditPanel = () => {
  const [apiToken, setApiToken] = useState('');


  const getContent = (module: iModule) => {
    return (
      <OperooSafetyAlertModuleEditPanelContent module={module} onUpdate={(token: string) => setApiToken(token)}/>
    )
  }

  return (
    <ModuleEditPanel
      moduleId={MODULE_ID_OPEROO_SAFETY_ALERTS}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => ({
        apiToken
      })}
    />
  )
}

export default OperooSafetyAlertModuleEditPanel;
