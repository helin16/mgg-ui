import {Form} from 'react-bootstrap';
import React, {useState} from 'react';
import styled from 'styled-components';

const mailGunTemplateUrl = 'https://app.mailgun.com/app/sending/domains/mentonegirls.vic.edu.au/templates';
const Wrapper = styled.div``;
type iModuleEmailTemplateNameEditor = {
  value: string;
  className?: string;
  onChange?: (event: any) => void;
  handleUpdate: (newValue: string) => void;
}
const ModuleEmailTemplateNameEditor = ({className, value, onChange, handleUpdate}: iModuleEmailTemplateNameEditor) => {
  const [localValue, setLocalValue] = useState(value || '');
  return (
    <Wrapper className={className}>
      <Form.Label>
        Notification Email Template can be created and managed at: {' '}
        <a href={mailGunTemplateUrl} target={'__BLANK'}>MailGun Template Page</a>.
        Copy the name of the template and paste it into below:
      </Form.Label>
      <Form.Control
        placeholder="Paste MailGun template name here."
        value={ value || localValue }
        onChange={(event) => {
          setLocalValue(event.target.value);
          if (onChange) {
            onChange(event);
          }
        }}
        onBlur={() => handleUpdate(localValue)}
      />
    </Wrapper>
  )
}

export default ModuleEmailTemplateNameEditor
