import React, {useState} from 'react';
import styled from 'styled-components';
import ModuleEmailTemplateNameEditor from '../../../components/module/ModuleEmailTemplateNameEditor';
import {MGGS_MODULE_ID_FINANCE} from '../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../types/modules/iRole';
import ModuleEditPanel from '../../../components/module/ModuleEditPanel';
import iModule from '../../../types/modules/iModule';
import SectionDiv from '../../../components/common/SectionDiv';
import {Form} from 'react-bootstrap';
import ExplanationPanel from '../../../components/ExplanationPanel';

const Wrapper = styled.div``;

type iEditPanel = {
  module: iModule;
  onUpdate: (data: any) => void;
}
const EditPanel = ({module, onUpdate}: iEditPanel) => {
  const [expiryCCTemplate, setExpiryCCTemplate] = useState(module.settings?.expiryCC?.templateName || '');
  const [expiryCCRecipients, setExpiryCCRecipients] = useState(module.settings?.expiryCC?.recipients || '');
  const [bpayBatchUserId, setBpayBatchUserId] = useState(module.settings?.bpayBatch?.batchUserId || '');
  const [bpayCustomerShortName, setBpayCustomerShortName] = useState(module.settings?.bpayBatch?.customerShortName || '');
  const [bpayPayerBankBSB, setBpayPayerBankBSB] = useState(module.settings?.bpayBatch?.payerBankBSB || '');
  const [bpayPayerBankAcc, setBpayPayerBankAcc] = useState(module.settings?.bpayBatch?.payerBankAcc || '');

  const handleUpdate = () => {
    onUpdate({
      ...(module?.settings || {}),
      expiryCC: {
        ...(module?.settings?.expiryCC || {}),
        templateName: expiryCCTemplate,
        recipients: expiryCCRecipients,
      },
      bpayBatch: {
        ...(module?.settings?.bpayBatch || {}),
        batchUserId: bpayBatchUserId,
        customerShortName: bpayCustomerShortName,
        payerBankBSB: bpayPayerBankBSB,
        payerBankAcc: bpayPayerBankAcc,
      },
    })
  }

  return (
    <Wrapper>
      <SectionDiv>
        <h5>Expiring Credit Cards Notification Settings</h5>
        <ExplanationPanel text={'Email notifications will be sent to the nominated recipients below every Wednesday night'} />
        <ModuleEmailTemplateNameEditor
          value={expiryCCTemplate}
          className={'content-row'}
          onChange={(event) => setExpiryCCTemplate(event.target.value)}
          handleUpdate={() => handleUpdate()}
        />
        <SectionDiv>
          <h6>Email Recipients</h6>
          <Form.Label>
            Recipients who will receive the notification (email addresses separated by <b>,</b>):
          </Form.Label>
          <Form.Control
            placeholder="Email address separated by ,"
            value={ expiryCCRecipients }
            onChange={(event) => {
              setExpiryCCRecipients(event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>
      </SectionDiv>
      <SectionDiv>
        <h5>BPAY Batch File Settings</h5>
        <ExplanationPanel text={'These values are used when generating the BPAY batch file header.'} />
        <SectionDiv>
          <h6>Batch User ID</h6>
          <Form.Control
            value={bpayBatchUserId}
            onChange={(event) => {
              setBpayBatchUserId(event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>
        <SectionDiv>
          <h6>Customer Short Name</h6>
          <Form.Control
            value={bpayCustomerShortName}
            onChange={(event) => {
              setBpayCustomerShortName(event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>
        <SectionDiv>
          <h6>Payer Bank BSB</h6>
          <Form.Control
            value={bpayPayerBankBSB}
            onChange={(event) => {
              setBpayPayerBankBSB(event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>
        <SectionDiv>
          <h6>Payer Bank Account</h6>
          <Form.Control
            value={bpayPayerBankAcc}
            onChange={(event) => {
              setBpayPayerBankAcc(event.target.value);
            }}
            onBlur={() => handleUpdate()}
          />
        </SectionDiv>
      </SectionDiv>
    </Wrapper>
  )
}
const FinanceAdminModuleSettings = () => {
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
      moduleId={MGGS_MODULE_ID_FINANCE}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => (settings)}
    />
  )
}

export default FinanceAdminModuleSettings;
