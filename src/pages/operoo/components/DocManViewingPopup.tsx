import iSynVDocument from '../../../types/Synergetic/iSynVDocument';
import PopupModal from '../../../components/common/PopupModal';

type iDocManViewingPopup = {
  document: iSynVDocument;
  onCancel: () => void;
}
const DocManViewingPopup = ({document, onCancel}: iDocManViewingPopup) => {
  console.log(document);
  return (
    <PopupModal title={`Viewing...`} show={true} handleClose={onCancel}>
      <p>{document.Description}</p>
    </PopupModal>
  )
};

export default DocManViewingPopup
