import {Button, ButtonProps, FormControl} from "react-bootstrap";
import PopupModal from "./PopupModal";
import React, { useState } from "react";
import * as Icons from "react-bootstrap-icons";
import styled from "styled-components";
import { FlexContainer } from "../../styles";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;

  .icon-btn {
    text-align: center;
    .icon {
      font-size: 23px;
    }
    .descr {
      font-size: 12px;
    }
  }
`;

export type iIcon = {
  name: string;
  component: React.FC<React.ComponentProps<"svg">>;
}

type iIconSelector = ButtonProps & {
  onIconSelected: (selected: iIcon) => void;
};

const IconSelector = ({ onIconSelected, ...props }: iIconSelector) => {
  const [isShowing, setIsShowing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleClose = () => {
    setIsShowing(false);
  };

  const getPopup = () => {
    const allIcons = Object.entries(Icons).map(([name, IconComponent]) => ({
      name,
      IconComponent: IconComponent as React.FC<React.ComponentProps<"svg">>
    }));
    return (
      <PopupModal
        show={isShowing === true}
        size={"xl"}
        header={
          <FlexContainer className={"justify-content-start align-items-center"}>
            <b style={{width: '150px'}}>Select an icon</b>
            <FormControl placeholder={'search a name...'} onChange={(event) => setSearchText(event.target.value || '')} />
          </FlexContainer>
        }
        handleClose={handleClose}
      >
        <Wrapper>
          {allIcons
            .filter(icon => icon.name.toLowerCase().includes(searchText.toLowerCase()))
            .sort((icon1, icon2) => (icon1.name > icon2.name ? 1 : -1))
            .map(({ name, IconComponent }) => {
              return (
                <Button
                  key={name}
                  onClick={() => {
                    handleClose();
                    onIconSelected({ name, component: IconComponent })
                  }}
                  className={"icon-btn"}
                  variant={"light"}
                >
                  <IconComponent className={"icon"} />
                  <div className={"descr"}>{name}</div>
                </Button>
              );
            })}
        </Wrapper>
      </PopupModal>
    );
  };

  return (
    <>
      <Button {...props} onClick={() => setIsShowing(true)} />
      {getPopup()}
    </>
  );
};

export default IconSelector;
