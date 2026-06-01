import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import PopupModal from "../../../components/common/PopupModal";
import LoadingBtn from "../../../components/common/LoadingBtn";

type iStudentAbsenceDailySummaryEmailModal = {
  show: boolean;
  isSending?: boolean;
  onClose: () => void;
  onSend: (recipientEmails: string) => Promise<void>;
};

const StudentAbsenceDailySummaryEmailModal = ({
  show,
  isSending = false,
  onClose,
  onSend,
}: iStudentAbsenceDailySummaryEmailModal) => {
  const [recipientEmails, setRecipientEmails] = useState("");

  return (
    <PopupModal
      show={show}
      handleClose={onClose}
      title={"Email Report"}
      footer={
        <>
          <Button variant={"secondary"} onClick={onClose}>
            Cancel
          </Button>
          <LoadingBtn
            variant={"primary"}
            isLoading={isSending}
            onClick={() => onSend(recipientEmails)}
          >
            Send
          </LoadingBtn>
        </>
      }
    >
      <Form.Group>
        <Form.Label>Email addresses</Form.Label>
        <Form.Control
          as={"textarea"}
          rows={4}
          value={recipientEmails}
          onChange={event => setRecipientEmails(event.target.value)}
          placeholder={"email1@example.com; email2@example.com"}
        />
      </Form.Group>
    </PopupModal>
  );
};

export default StudentAbsenceDailySummaryEmailModal;
