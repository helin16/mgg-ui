import styled from "styled-components";
import * as Icons from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import { FlexContainer } from "../styles";
import { ROLE_ID_ADMIN } from "../types/modules/iRole";
import ModuleAccessWrapper from '../components/module/ModuleAccessWrapper';
import React from 'react';

type iAdminPage = {
  title: any;
  onNavBack: () => void;
  children: any;
  moduleId: number;
};

const Wrapper = styled.div``;
const AdminPage = ({ title, onNavBack, children, moduleId }: iAdminPage) => {
  const getBackToListBtn = () => {
    return (
      <Button variant={'danger'} size={'sm'} onClick={() => onNavBack()}>
        <Icons.ArrowLeft /> Back
      </Button>
    )
  }

  return (
    <ModuleAccessWrapper
      moduleId={moduleId}
      roleId={ROLE_ID_ADMIN}
      btns={getBackToListBtn()}
    >
      <Wrapper>
        <FlexContainer className={"with-gap"}>
          <Button variant={"link"} size={"sm"} onClick={() => onNavBack()}>
            <Icons.ArrowLeft />
          </Button>
          {title}
        </FlexContainer>
        <div className={"body"}>{children}</div>
      </Wrapper>
    </ModuleAccessWrapper>
  );
};

export default AdminPage;
