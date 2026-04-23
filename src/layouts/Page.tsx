import React, { useState } from "react";
import styled from "styled-components";
import ModuleAdminBtn from "../components/module/ModuleAdminBtn";
import {FlexContainer} from '../styles';

type iPage = {
  children: React.ReactNode;
  className?: string;
  title?: any;
  AdminPage?: any;
  adminPageProps?: any;
  moduleId?: number;
  extraBtns?: any;
};
const Wrapper = styled.div``;

const Page = ({
  children,
  className,
  moduleId,
  title,
  AdminPage,
  adminPageProps,
  extraBtns,
}: iPage) => {
  const [showingAdminPage, setShowingAdminPage] = useState(false);

  const getAdminBtn = () => {
    if (!moduleId || !AdminPage) {
      return null;
    }
    return (
      <div className={"pull-right"}>
        {extraBtns} {' '}
        <ModuleAdminBtn
          moduleId={moduleId}
          size={"sm"}
          onClick={() => setShowingAdminPage(true)}
        />
      </div>
    );
  };
  const getTitleRow = () => {
    if (!title) {
      return null;
    }
    return (
      <FlexContainer className={"title-row justify-content-between"}>
        {title ? <div className={"pull-left"}>{title}</div> : null}
        {getAdminBtn()}
      </FlexContainer>
    );
  };

  const getContent = () => {
    if (showingAdminPage === true) {
      return (
        <AdminPage
          {...adminPageProps}
          onNavBack={() => setShowingAdminPage(false)}
        />
      );
    }
    return (
      <>
        {getTitleRow()}
        {children}
      </>
    );
  };

  return <Wrapper className={className}>{getContent()}</Wrapper>;
};

export default Page;
