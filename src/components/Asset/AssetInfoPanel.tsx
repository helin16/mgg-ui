import styled from 'styled-components';
import iAsset from '../../types/asset/iAsset';
import SectionDiv from '../common/SectionDiv';
import {useEffect, useState} from 'react';
import Toaster from '../../services/Toaster';
import AssetService from '../../services/Asset/AssetService';
import PageLoadingSpinner from '../common/PageLoadingSpinner';
import FormLabel from '../form/FormLabel';
import {FormControl} from 'react-bootstrap';
import PanelTitle from '../PanelTitle';

const Wrapper = styled.div``

type iAssetInfoPanel = {
  className?: string;
  assetId: string;
  extraBtns?: any;
}
const AssetInfoPanel = ({assetId, className}: iAssetInfoPanel) => {

  const [isLoading, setIsLoading] = useState(false);
  const [asset, setAsset] = useState<iAsset | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    AssetService.getAll({
      where: JSON.stringify({
        id: assetId,
      }),
    })
      .then(resp => {
        if (isCancelled === true) {
          return;
        }
        const data = resp.data || [];
        // @ts-ignore
        setAsset(data.length > 0 ? data[0] : null);
      })
      .catch(err => {
        if (isCancelled === true) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled === true) {
          return;
        }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [assetId]);

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />
    }

    return (
      <>
        <PanelTitle><div className={'ellipsis'}>Asset Info: {asset?.fileName || ''}</div></PanelTitle>

        <SectionDiv>
          <FormLabel label={'File Name'} />
          <FormControl value={asset?.fileName || ''} disabled={true} />
        </SectionDiv>

        <SectionDiv>
          <FormLabel label={'Url'} />
          <FormControl value={asset?.url || ''} disabled={true} />
        </SectionDiv>

        <SectionDiv>
          <FormLabel label={'Type'} />
          <FormControl value={asset?.type || ''} disabled={true} />
        </SectionDiv>

        <SectionDiv>
          <FormLabel label={'Mime Type'} />
          <FormControl value={asset?.mimeType || ''} disabled={true} />
        </SectionDiv>

        <SectionDiv>
          <FormLabel label={'File Size'} />
          <FormControl value={asset?.fileSize || ''} disabled={true} />
        </SectionDiv>

        <SectionDiv>
          <FormLabel label={'Public Id'} />
          <FormControl value={asset?.externalId || ''} disabled={true} />
        </SectionDiv>

        <SectionDiv>
          <FormLabel label={'Streaming Url'} />
          <FormControl value={asset?.streamUrl || ''} disabled={true} />
        </SectionDiv>

        <SectionDiv>
          <FormLabel label={'Download Url'} />
          <FormControl value={asset?.downloadUrl || ''} disabled={true} />
        </SectionDiv>

        <SectionDiv>
          <FormLabel label={'Path on server'} />
          <FormControl value={asset?.filePath || ''} disabled={true} />
        </SectionDiv>

        <SectionDiv>
          <FormLabel label={'Comments'} />
          <FormControl value={asset?.comments || ''} disabled={true} />
        </SectionDiv>

        <SectionDiv>
          <FormLabel label={'External Object'} />
          <FormControl value={asset?.externalObj ? JSON.stringify(asset?.externalObj, null, 4) : ''} disabled={true} as="textarea" rows={10}/>
        </SectionDiv>
      </>
    )
  }

  return (
    <Wrapper className={`asset-info-wrapper ${className || ''}`}>
      {getContent()}
    </Wrapper>
  )
}

export default AssetInfoPanel;
