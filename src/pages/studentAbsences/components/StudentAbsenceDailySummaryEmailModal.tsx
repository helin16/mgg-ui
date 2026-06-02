import { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";

import PopupModal from "../../../components/common/PopupModal";
import LoadingBtn from "../../../components/common/LoadingBtn";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const parseValidEmails = (value: string): string[] => {
  return value
    .split(";")
    .map(e => e.trim())
    .filter(e => EMAIL_REGEX.test(e));
};

type iStudentAbsenceDailySummaryEmailModal = {
  show: boolean;
  isSending?: boolean;
  onClose: () => void;
  onSend: (recipientEmails: string, emailBody: string) => Promise<void>;
};

const StudentAbsenceDailySummaryEmailModal = ({
  show,
  isSending = false,
  onClose,
  onSend,
}: iStudentAbsenceDailySummaryEmailModal) => {
  const [recipientEmails, setRecipientEmails] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const hasValidEmails = useMemo(
    () => parseValidEmails(recipientEmails).length > 0,
    [recipientEmails]
  );

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
            disabled={!hasValidEmails}
            onClick={() => onSend(recipientEmails, emailBody)}
          >
            Send
          </LoadingBtn>
        </>
      }
    >
      <Form.Group className={"mb-3"}>
        <Form.Label>
          Email Addresses <span className={"text-danger"}>*</span>
        </Form.Label>
        <Form.Control
          type={"text"}
          value={recipientEmails}
          onChange={event => setRecipientEmails(event.target.value)}
          placeholder={"email1@example.com; email2@example.com"}
        />
        <Form.Text className={"text-muted"}>Separated with ;</Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Email Body</Form.Label>
        <Form.Control
          as={"textarea"}
          rows={4}
          value={emailBody}
          onChange={event => setEmailBody(event.target.value)}
          placeholder={"Optional message to include in the email body"}
        />
      </Form.Group>
    </PopupModal>
  );
};

export default StudentAbsenceDailySummaryEmailModal;
