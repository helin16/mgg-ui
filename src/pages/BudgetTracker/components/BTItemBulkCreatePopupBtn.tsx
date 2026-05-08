import styled from "styled-components";
import PopupModal from "../../../components/common/PopupModal";
import React, { useState } from "react";
import iSynGeneralLedger from "../../../types/Synergetic/Finance/iSynGeneralLedager";
import BTItemBulkCreatePanel from "./BTItemBulkCreatePanel";

type iBTItemBulkCreatePopupBtn = {
  onItemsSaved: (count: number) => void;
  children: any;
  gl: iSynGeneralLedger;
  forYear: number;
  className?: string;
};

const Wrapper = styled.div``;

const BTItemBulkCreatePopupBtn = ({
  onItemsSaved,
  children,
  gl,
  forYear,
  className
}: iBTItemBulkCreatePopupBtn) => {
  const [showingPopup, setShowingPopup] = useState(false);

  const closePopup = () => {
    setShowingPopup(false);
  };

  return (
    <>
      <Wrapper
        className={className}
        onClick={() => {
          setShowingPopup(true);
        }}
      >
        {children}
      </Wrapper>
      <PopupModal
        header={<b>Bulk Create Items for {gl.GLCode} - {gl.GLDescription} in {forYear}</b>}
        show={showingPopup}
        handleClose={closePopup}
        size={"xl"}
      >
        <BTItemBulkCreatePanel
          gl={gl}
          forYear={forYear}
          onCancel={closePopup}
          onItemsSaved={count => {
            closePopup();
            onItemsSaved(count);
          }}
        />
      </PopupModal>
    </>
  );
};

export default BTItemBulkCreatePopupBtn;
