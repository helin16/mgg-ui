import {Button, Form} from 'react-bootstrap';
import SignatureInput from '../../../components/common/SignatureInput';
import PickupPageLayout from './PickupPageLayout';
import React, {useState} from 'react';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import SignatureCanvas from 'react-signature-canvas';
import FormErrorDisplay, {iErrorMap} from '../../../components/form/FormErrorDisplay';

type iAssetPickupConfirm = {
  selectedProfile: iSynCommunity;
  clearSelectedProfile?: () => void;
}
const AssetPickupConfirm = ({selectedProfile, clearSelectedProfile}: iAssetPickupConfirm) => {
  const [signaturePad, setSignaturePad] = useState<SignatureCanvas | null>(null);
  const [errors, setErrors] = useState<iErrorMap>({});

  const preSubmit = () => {
    const errorMap: iErrorMap = {};

    if (signaturePad?.isEmpty()) {
      errorMap.signature = 'Signature is required';
    }

    setErrors(errorMap);
    return Object.keys(errorMap).length === 0;
  }

  const handleSubmit = () => {
    if (preSubmit() !== true) {
      return;
    }

  }

  const getCancelBtn = () => {
    if(!clearSelectedProfile) {
      return null;
    }
    return (
      <><Button variant={'light'} onClick={() => clearSelectedProfile()}>Cancel</Button> {' '}</>
    )
  }

  return (
    <PickupPageLayout
      communityProfile={selectedProfile}
      actionBtns={<div className={'text-right space top'}>
        {getCancelBtn()}
        <Button variant={'primary'} onClick={handleSubmit}>Submit</Button>
      </div>}
    >
      <Form>
        <p>I (<b>{selectedProfile.Given1} {selectedProfile.Surname}</b>) am here to pick up the following device(s) / equipment(s)</p>
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control />
        </Form.Group>
        <div className={'space top bottom'}>
          <label>By signing off this form, you've agree to above terms and conditions</label>
          <SignatureInput setSignatureInputPad={(pad) => setSignaturePad(pad)}/>
          <FormErrorDisplay errorsMap={errors} fieldName={'signature'} />
        </div>
      </Form>
    </PickupPageLayout>
  )

}



export default AssetPickupConfirm
