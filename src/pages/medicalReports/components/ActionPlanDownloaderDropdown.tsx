import Dropdown from 'react-bootstrap/Dropdown';
import styled from 'styled-components';
import iSynVDocument from '../../../types/Synergetic/iSynVDocument';
import {Button, FormControl, Spinner} from 'react-bootstrap';
import {useState} from 'react';
import LoadingBtn from '../../../components/common/LoadingBtn';
import PopupModal from '../../../components/common/PopupModal';
import SynVDocumentService from '../../../services/Synergetic/SynVDocumentService';
import Toaster from '../../../services/Toaster';

const Wrapper = styled.div`
  .ap-dropdown {
    button {
      font-size: 11px;
      padding: 0.125rem 0.5rem;
    }
  }
`;

type iActionPlanDownloaderDropdown = {
  docs: iSynVDocument[];
  isLoading: boolean;
}
const ActionPlanDownloaderDropdown = ({docs, isLoading}: iActionPlanDownloaderDropdown) => {

  const [loadingDocSeq, setLoadingDocSeq] = useState<number | null>(null);
  const showDocument = (tDocumentsSeq: number) => {
    setLoadingDocSeq(tDocumentsSeq);
    SynVDocumentService.getVDocumentBySeq(tDocumentsSeq)
      .then(resp => {
        if (tDocumentsSeq === null) {
          return;
        }
        if (resp.tDocumentsSeq !== tDocumentsSeq) {
          return;
        }
        SynVDocumentService.openDocument(resp);
      }).catch(err => {
        if (tDocumentsSeq === null) {
          return;
        }
        Toaster.showApiError(err)
      }).finally(() => {
        if (tDocumentsSeq === null) {
          return;
        }
        setLoadingDocSeq(null);
      })
  }

  const onClose = () => {
    setLoadingDocSeq(null);
  }

  const getLoadingPopup = () => {
    if (loadingDocSeq === null) {
      return null;
    }
    return <PopupModal
      show={loadingDocSeq !== null}
      handleClose={onClose}
      title={'Loading document...'}
    >
      <div><Spinner animation={'border'}/><div>Loading document details...</div></div>
    </PopupModal>
  }


  if (isLoading) {
    return <Spinner animation={'border'} size={'sm'} />
  }

  if (docs.length <= 0) {
    return null;
  }

  return (
    <Wrapper>
      <Dropdown className={'ap-dropdown'}>
        <Dropdown.Toggle variant="primary" size={'sm'}>
          Medical Docs
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {
            docs.map(doc => {
              return (
                <Dropdown.Item key={doc.tDocumentsSeq}>
                  <LoadingBtn variant={'link'} onClick={() => showDocument(doc.tDocumentsSeq)}>
                    {doc.Description}
                  </LoadingBtn>
                </Dropdown.Item>
              );
            })
          }
        </Dropdown.Menu>
      </Dropdown>
      {getLoadingPopup()}
    </Wrapper>
  )
}

export default ActionPlanDownloaderDropdown;
