import iSynVDocument from '../../../types/Synergetic/iSynVDocument';
import PopupModal from '../../../components/common/PopupModal';
import styled from 'styled-components';
import {getDocumentUrl, openDocument} from '../../../services/Synergetic/SynVDocumentService';
import {Button} from 'react-bootstrap';

type iDocManViewingPopup = {
  document: iSynVDocument;
  onCancel: () => void;
}

const Wrapper = styled.div`
  .current-doc {
    width: 50%;
    iframe {
      height: calc(100vh - 12.5rem);
      width: 100%;
    }
  }
  .title-row {
    display: flex;
    justify-content: space-between;
    button {
      padding: 0px;
    }
  }
`;
const DocManViewingPopup = ({document, onCancel}: iDocManViewingPopup) => {
  return (
    <PopupModal
      title={<small style={{fontSize: '14px'}}>Viewing...</small>}
      show={true}
      handleClose={onCancel}
      fullscreen
      footer={
        <>
          <Button variant={'default'} onClick={() => onCancel()}>Cancel</Button>
        </>
      }
    >
      <Wrapper>
        <div className={'current-doc'}>
          <div className={'title-row'}>
            <div>Current: <b>{document.Description}</b></div>
            <Button variant={'link'} size={'sm'} onClick={() => openDocument(document)}>View fullscreen</Button>
          </div>
          <iframe src={getDocumentUrl(document)} />
        </div>
      </Wrapper>
    </PopupModal>
  )
};

export default DocManViewingPopup
