import styled from 'styled-components';
import {FlexContainer} from '../../../styles';
import {Button} from 'react-bootstrap';
import {getDocumentUrl, openDocument} from '../../../services/Synergetic/SynVDocumentService';
import iSynVDocument from '../../../types/Synergetic/iSynVDocument';

type iOperooExisitingDocViewer = {
  document?: iSynVDocument;
}

const Wrapper = styled.div`
  iframe {
    height: calc(100vh - 12.5rem);
    width: 100%;
  }
  img.current-doc-img {
    object-fit: contain;
    height: calc(100vh - 12.5rem);
    width: 100%;
  }
`;
const OperooExisitingDocViewer = ({document}: iOperooExisitingDocViewer) => {

  const getTitleRow = () => {
    if (!document) {
      return null;
    }
    return (
      <FlexContainer className={'justify-content space-between'}>
        <div>Current: <b>{document.Description}</b></div>
        <Button variant={'link'} size={'sm'} onClick={() => openDocument(document)}>View fullscreen</Button>
      </FlexContainer>
    )
  }

  const getViewer = () => {
    if (!document) {
      return null;
    }
    // const fileType = SynVDocumentService.getFileExtensionFromFileName(alert.operooRecord?.attachment_name || '').toLowerCase();
    // if (fileType === 'pdf') {
      return <iframe src={getDocumentUrl(document)} title={'current-doc'} />;
    // }
    // if (fileType === 'jpg' || fileType === 'png') {
    //   return null;
    // }
    // return null;
  }

  if (!document) {
    return null;
  }

  return (
    <Wrapper>
      {getTitleRow()}
      {getViewer()}
    </Wrapper>
  )
};

export default OperooExisitingDocViewer;
