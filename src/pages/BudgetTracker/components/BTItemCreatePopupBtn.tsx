import styled from "styled-components";
import PopupModal from "../../../components/common/PopupModal";
import React, { useState } from "react";
import BTItemEditPanel from "./BTItemEditPanel";
import iBTItem from "../../../types/BudgetTacker/iBTItem";
import iSynGeneralLedger from "../../../types/Synergetic/Finance/iSynGeneralLedager";

type iBTItemCreatePopupBtn = {
  onItemSaved: (newItem: iBTItem) => void;
  children: any;
  gl: iSynGeneralLedger;
  forYear: number;
  btItem?: iBTItem;
  hidePopup?: boolean;
  forceReadyOnly?: boolean;
  className?: string;
};

const Wrapper = styled.div``;

const BTItemCreatePopupBtn = ({
  onItemSaved,
  children,
  btItem,
  gl,
  forYear,
  hidePopup = false,
  forceReadyOnly = false,
  className
}: iBTItemCreatePopupBtn) => {
  const [showingPopup, setShowingPopup] = useState(false);

  const closePopup = () => {
    // setEditingBtItem(initialItem);
    setShowingPopup(false);
  };

  const getPopup = () => {
    return (
      <PopupModal
        header={
          <b>
            {btItem?.id
              ? `Editing`
              : `Request for ${gl.GLCode} - ${gl.GLDescription} in ${forYear}`}
          </b>
        }
        show={showingPopup}
        handleClose={closePopup}
        size={"lg"}
      >
        <BTItemEditPanel
          onCancel={() => closePopup()}
          gl={gl}
          forYear={forYear}
          btItem={btItem}
          readyOnly={forceReadyOnly}
          onItemSaved={saved => {
            closePopup();
            onItemSaved(saved);
          }}
        />
      </PopupModal>
    );
  };
  return (
    <>
      <Wrapper className={className} onClick={() => {
        if (hidePopup === true) {
          return
        }
        setShowingPopup(true)
      }}>
        {children}
      </Wrapper>
      {getPopup()}
    </>
  );
};

export default BTItemCreatePopupBtn;
