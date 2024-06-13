import { Button, ButtonProps } from "react-bootstrap";
import iSynCommunicationTemplate from "../../../types/Synergetic/iSynCommunicationTemplate";
import usePopupHook from "../../../components/hooks/usePopupHook/usePopupHook";
import SynEmailSendPanel from './SynEmailSendPanel';

type iSynEmailSendPopupBtn = ButtonProps & {
  template: iSynCommunicationTemplate;
};

const SynEmailSendPopupBtn = ({
  template,
  ...props
}: iSynEmailSendPopupBtn) => {

  const handleClose = () => {
    closePopup();
  }

  const { openPopup, getPopup, closePopup } = usePopupHook({
    popupProps: {
      header: <b>Sending emails using <u>{template.Name}</u></b>,
      size: 'xl',
      children: <SynEmailSendPanel template={template} onSentSuccess={() => handleClose() }/>,
    }
  });

  return (
    <>
      <Button {...props} onClick={() => openPopup()}/>
      {getPopup()}
    </>
  );
};

export default SynEmailSendPopupBtn;
