import styled from "styled-components";
import PopupModal from "../PopupModal";
import { ChangeEvent, ReactElement, useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import LoadingBtn from "../LoadingBtn";

type iParam = {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmBtnString?: string;
  confirmString: string;
  confirmBtnVariant?: string;
  isDeleting?: boolean;
  description?: string | ReactElement;
  title?: string;
};

const Wrapper = styled.div`
  input {
    margin: 4px 0;
  }
  .confirm-text-wrapper {
    font-size: 10px;
    .confirm-text {
      background-color: #5c636a;
      color: white;
      padding: 2px 4px;
      border-radius: 4px;
    }
  }
`;

const DeleteByRetype = ({
  title,
  isOpen,
  onClose,
  onConfirm,
  confirmString,
  isDeleting,
  description,
  confirmBtnVariant,
  confirmBtnString
}: iParam) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const handleConfirmedText = (event: ChangeEvent<HTMLInputElement>) => {
    setIsConfirmed(
      `${event.target.value || ""}`.trim().toLowerCase() ===
        `${confirmString || ""}`.trim().toLowerCase()
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <PopupModal
      show={isOpen}
      handleClose={onClose}
      title={title || "Are you sure?"}
      footer={
        <>
          <Button variant={"link"} onClick={onClose}>
            Cancel
          </Button>
          <LoadingBtn
            isLoading={isDeleting}
            disabled={!isConfirmed}
            variant={confirmBtnVariant || "danger"}
            onClick={onConfirm}
          >
            {confirmBtnString || "Delete"}
          </LoadingBtn>
        </>
      }
    >
      <Wrapper>
        <div className={"description-wrapper"}>
          {description || "You are about to delete the selected item."}
        </div>
        <FormControl
          type={"text"}
          placeholder={confirmString}
          onChange={handleConfirmedText}
        />
        <div className={"confirm-text-wrapper"}>
          Please type in <span className={"confirm-text"}>{confirmString}</span>{" "}
          into above text box to confirm.
        </div>
      </Wrapper>
    </PopupModal>
  );
};

export default DeleteByRetype;
