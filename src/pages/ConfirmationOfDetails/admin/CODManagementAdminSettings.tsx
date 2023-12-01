import React, {useState} from 'react';
import iModule from '../../../types/modules/iModule';
import ModuleEditPanel from '../../../components/module/ModuleEditPanel';
import {MGGS_MODULE_ID_COD} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import SectionDiv from '../../../components/common/SectionDiv';
import ExplanationPanel from '../../../components/ExplanationPanel';
import {Form} from 'react-bootstrap';
import styled from 'styled-components';

const Wrapper = styled.div``;

type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
}

const EditPanel = ({module, onUpdate}: iEditPanel) => {
  const [urlMap, setUrlMap] = useState(module.settings?.permissionUrls || {});

  const updateUrlMap = (fieldName: string, newValue: string) => {
    setUrlMap({
      ...urlMap,
      [fieldName]: newValue,
    });
  }

  const handleUpdate = () => {
    onUpdate({
      ...(module?.settings || {}),
      permissionUrls: urlMap,
    })
  }

  return (
    <Wrapper>
      <SectionDiv className={'margin-bottom'}>
        <h5>Permission URLs</h5>
        <ExplanationPanel text={'Admin users can update the URLs on the permission page, that parents need to agree before submit.'} />

        <SectionDiv>
          <Form.Label>
            The url of <u>Excursion Permission</u> that will allow parent to click and view on COD form:
          </Form.Label>
          <Form.Control
            placeholder="The url of Excursion Permission."
            value={ urlMap.excursion || '' }
            onChange={(event) => {
              updateUrlMap('excursion', event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>

        <SectionDiv>
          <Form.Label>
            The url of <u>Parental Consent for Use of Images</u> that will allow parent to click and view on COD form:
          </Form.Label>
          <Form.Control
            placeholder="The url of Parental Consent for Use of Images."
            value={ urlMap.imageConsent || '' }
            onChange={(event) => {
              updateUrlMap('imageConsent', event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>

        <SectionDiv>
          <Form.Label>
            The url of <u>Commitment to School</u> that will allow parent to click and view on COD form:
          </Form.Label>
          <Form.Control
            placeholder="The url of Commitment to School."
            value={ urlMap.schoolCommitment || '' }
            onChange={(event) => {
              updateUrlMap('schoolCommitment', event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>

        <SectionDiv>
          <Form.Label>
            The url of <u>Lawful Authority</u> that will allow parent to click and view on COD form:
          </Form.Label>
          <Form.Control
            placeholder="The url of Lawful Authority."
            value={ urlMap.lawfulAuthority || '' }
            onChange={(event) => {
              updateUrlMap('lawfulAuthority', event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>

        <SectionDiv>
          <Form.Label>
            The url of <u>Privacy Policy</u> that will allow parent to click and view on COD form:
          </Form.Label>
          <Form.Control
            placeholder="The url of Privacy Policy."
            value={ urlMap.privacyPolicy || '' }
            onChange={(event) => {
              updateUrlMap('privacyPolicy', event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>
      </SectionDiv>
    </Wrapper>
  )
}

const CODManagementAdminSettings = () => {
  const [settings, setSettings] = useState({});

  const getContent = (module: iModule) => {
    return (
      <EditPanel
        module={module}
        onUpdate={(newSettings: any) => setSettings(newSettings)}
      />
    );
  }

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_COD}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => (settings)}
    />
  )
}

export default CODManagementAdminSettings;



