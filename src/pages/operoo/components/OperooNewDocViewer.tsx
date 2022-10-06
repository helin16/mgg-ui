import styled from 'styled-components';
import {FlexContainer} from '../../../styles';
import {Button} from 'react-bootstrap';
import SynVDocumentService from '../../../services/Synergetic/SynVDocumentService';
import iOperooSafetyAlert from '../../../types/Operoo/iOperooSafetyAlert';

type iOperooDocViewer = {
  alert: iOperooSafetyAlert;
}

const Wrapper = styled.div`
  iframe {
    height: calc(100vh - 12.5rem);
    width: 100%;
  }
  img.current-doc-img {
    object-fit: contain;
    object-position: top center;
    height: calc(100vh - 12.5rem);
    width: 100%;
  }
`;
const OperooNewDocViewer = ({alert}: iOperooDocViewer) => {

  const getTitleRow = () => {
    if (!alert.operooRecord) {
      return null;
    }
    return (
      <FlexContainer className={'justify-content space-between'}>
        <div>Current: <b>{alert.operooRecord?.attachment_name}</b></div>
        <Button variant={'link'} size={'sm'} target={'__BLANK'} href={alert.operooRecord?.attachment_url || ''}>View fullscreen</Button>
      </FlexContainer>
    )
  }

  const getViewer = () => {
    if (!alert.operooRecord) {
      return null;
    }
    const fileType = SynVDocumentService.getFileExtensionFromFileName(alert.operooRecord?.attachment_name || '').toLowerCase();
    if (fileType === 'pdf') {
      return <iframe src={alert.operooRecord?.attachment_url || ''} title={'current-doc'}/>;
    }
    if (fileType === 'jpg' || fileType === 'png') {
      return <img src={alert.operooRecord?.attachment_url || ''} className={'current-doc-img'} alt={'current-doc'}/>;
    }
    return null;
  }

  if (!alert.operooRecord) {
    return null;
  }

  return (
    <Wrapper>
      {getTitleRow()}
      {getViewer()}
    </Wrapper>
  )
};

export default OperooNewDocViewer;
