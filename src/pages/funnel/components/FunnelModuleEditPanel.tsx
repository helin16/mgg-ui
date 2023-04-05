import React, {useState} from 'react';
import {Form} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import styled from 'styled-components';
import {MGGS_MODULE_ID_FUNNEL} from '../../../types/modules/iModuleUser';
import ModuleEditPanel from '../../../components/module/ModuleEditPanel';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import iModule from '../../../types/modules/iModule';


type iFunnelModuleEditPanelContent = {
  module: iModule;
  onUpdate: (data: any) => void;
}

const funnelApiGenUrl = 'https://mggs-au-vic-254.app.digistorm.com/admin/settings/profile/#api';
const funnelApiEndPointUrl = 'https://mggs-au-vic-254.app.digistorm.com/docs/graphql/overview';

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
  .content-row {
    margin-bottom: 0.6rem;
  }
`;
const FunnelModuleEditPanelContent = ({module, onUpdate}: iFunnelModuleEditPanelContent) => {
  const [token, setToken] = useState(module?.settings?.token || '');
  const [endPoint, setEndPoint] = useState(module?.settings?.endPoint || '');
  const [inputType, setInputType] = useState(INPUT_TYPE_PASSWORD);

  const handleUpdate = () => {
    onUpdate({
      ...module?.settings,
      ...(token ? {token} : {}),
      ...(endPoint ? {endPoint} : {}),
    })
  }

  return (
    <Wrapper>
      <Form.Group controlId="apiToken" className={'content-row'}>
        <Form.Label>
          Funnel GraphQL EndPoint {' '}
          <a href={funnelApiEndPointUrl} target={'__BLANK'}>Funnel API Doc</a>,
          and pasted below:
        </Form.Label>
        <Form.Control
          placeholder="Paste the endPoint url here."
          type={'text'}
          value={endPoint}
          onChange={(event) => setEndPoint(event.target.value)}
          onBlur={() => handleUpdate()}
        />
      </Form.Group>
      <Form.Group controlId="apiToken" className={'content-row'}>
        <Form.Label>
          Funnel API token can be generated from {' '}
          <a href={funnelApiGenUrl} target={'__BLANK'}>Funnel admin {'>'} Settings {'>'} My Funnel {'>'} API</a>,
          and pasted below:
        </Form.Label>
        <InputGroup>
          <Form.Control
            placeholder="Paste your newly generated API token here."
            type={inputType}
            value={token}
            onChange={(event) => setToken(event.target.value)}
            onBlur={() => handleUpdate()}
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

const FunnelModuleEditPanel = () => {
  const [settings, setSettings] = useState({});


  const getContent = (module: iModule) => {
    return (
      <FunnelModuleEditPanelContent module={module} onUpdate={(newSettings: any) => setSettings(newSettings)}/>
    )
  }

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_FUNNEL}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => (settings)}
    />
  )
}

export default FunnelModuleEditPanel;
