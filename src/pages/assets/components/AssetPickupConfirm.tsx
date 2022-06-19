import {Button, Form, Spinner, Alert, Table} from 'react-bootstrap';
import SignatureInput from '../../../components/common/SignatureInput';
import PickupPageLayout from './PickupPageLayout';
import React, {useEffect, useState} from 'react';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import SignatureCanvas from 'react-signature-canvas';
import FormErrorDisplay, {iErrorMap} from '../../../components/form/FormErrorDisplay';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iAssetRecord from '../../../types/asset/iAssetRecord';
import AssetRecordService from '../../../services/Asset/AssetRecordService';

type iAssetPickupConfirm = {
  selectedProfile: iSynCommunity;
  clearSelectedProfile?: () => void;
}
const AssetPickupConfirm = ({selectedProfile, clearSelectedProfile}: iAssetPickupConfirm) => {
  const [isLoading, setIsLoading] = useState(false);
  const [signaturePad, setSignaturePad] = useState<SignatureCanvas | null>(null);
  const [errors, setErrors] = useState<iErrorMap>({});
  const [assetRecords, setAssetRecords] = useState<iPaginatedResult<iAssetRecord> | null>(null);
  const [selectedAssetRecordIds, setSelectedAssetRecordIds] = useState<string[]>([]);

  useEffect(() => {
    if(!selectedProfile.ID || `${selectedProfile.ID || ''}`.trim() === '') { return }

    setIsLoading(true);
    AssetRecordService.getAssetRecords({
        where: JSON.stringify({synId: selectedProfile.ID}),
        include: `AssetRecordType`
      })
      .then(resp => {
        setAssetRecords(resp);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, [selectedProfile])

  const preSubmit = () => {
    const errorMap: iErrorMap = {};

    if (selectedAssetRecordIds.length <= 0) {
      errorMap.selectedRecords = 'Need to select one device at least.'
    }

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
    const data = {
      synId: selectedProfile.ID,
      signatureImg: signaturePad?.toDataURL(),
      selectedAssetRecordIds,
    }
    console.log(data);
    return;
  }

  const getCancelBtn = () => {
    if(!clearSelectedProfile) {
      return null;
    }
    return (
      <><Button variant={'link'} onClick={() => clearSelectedProfile()}>Cancel</Button> {' '}</>
    )
  }

  const getSubmitBtn = () => {
    if (assetRecords === null || !('data' in assetRecords) || assetRecords.data.length <= 0) {
      return null;
    }
    return (
      <Button variant={'primary'} onClick={handleSubmit}>Submit</Button>
    )
  }

  const handleSelectingAssetRecord = (event: any, assetRecord: iAssetRecord) => {
    const otherIds = selectedAssetRecordIds.filter((id => id !== assetRecord.id));
    if (event.target.checked === true) {
      setSelectedAssetRecordIds([...otherIds, assetRecord.id]);
      return ;
    }
    setSelectedAssetRecordIds(otherIds);
  }

  const getDeviceList = () => {
    if (assetRecords === null || !('data' in assetRecords) || assetRecords.data.length <= 0) {
      return null;
    }
    return (
      <div className={'device-list'}>
        {assetRecords.data.map(assetRecord => {
          return (
            <div key={assetRecord.id}>
              <Form.Check
                type={'checkbox'}
                id={assetRecord.id}
                label={`${assetRecord.assetTag} - ${assetRecord.description}`}
                checked={selectedAssetRecordIds.indexOf(assetRecord.id) >= 0}
                onChange={(event) => handleSelectingAssetRecord(event, assetRecord)}
              />
            </div>
          )
        })}
        <FormErrorDisplay errorsMap={errors} fieldName={'selectedRecords'} />
      </div>
    )
  }

  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'} />
    }
    if (assetRecords === null || !('data' in assetRecords) || assetRecords.data.length <= 0) {
      return (
        <Alert>Sorry, we couldn't find anything that is <b>Ready for Pickup</b> for <b>{selectedProfile.Given1} {selectedProfile.Surname}</b>.</Alert>
      );
    }
    return (
      <Form>
        <p>I (<b>{selectedProfile.Given1} {selectedProfile.Surname}</b>) am here to pick up the following device(s) / equipment(s)</p>
        {getDeviceList()}
        <div className={'space top bottom'}>
          <label>By signing off this form, you've agree to above terms and conditions</label>
          <SignatureInput setSignatureInputPad={(pad) => setSignaturePad(pad)}/>
          <FormErrorDisplay errorsMap={errors} fieldName={'signature'} />
        </div>
      </Form>
    )
  }

  return (
    <PickupPageLayout
      communityProfile={selectedProfile}
      actionBtns={<div className={'text-right space top'}>
        {getCancelBtn()}
        {getSubmitBtn()}
      </div>}
    >
      {getContent()}
    </PickupPageLayout>
  )

}



export default AssetPickupConfirm
