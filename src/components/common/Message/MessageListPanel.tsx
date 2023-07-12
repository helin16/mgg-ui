import React, { useEffect, useState } from "react";
import iMessage from "../../../types/Message/iMessage";
import MessageService from "../../../services/MessageService";
import Toaster from "../../../services/Toaster";
import { Spinner, Table } from "react-bootstrap";
import styled from "styled-components";
import moment from "moment-timezone";
import iPaginatedResult from "../../../types/iPaginatedResult";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import * as _ from "lodash";
import PopupModal from "../PopupModal";
import MathHelper from "../../../helper/MathHelper";
import * as Icons from "react-bootstrap-icons";
import { FlexContainer } from "../../../styles";
import { iLoadingBtn } from "../LoadingBtn";
import MessageCreatePopupBtn from "./MessageCreatePopupBtn";

type iMessageListPanel = {
  type: string;
  reloadCount?: number;
  title?: any;
  createMsgFn?: () => Promise<iMessage>;
  createMsgBtnProps?: iLoadingBtn;
};

const Wrapper = styled.div`
  .message-table-wrapper {
    overflow-y: hidden;
    overflow-x: auto;
    max-width: 100%;
    .message-table {
      .date {
        width: 10rem;
      }
      .status {
        width: 10rem;
        &.SUCCESS {
          background-color: green;
          color: white;
        }
        &.PROCESSING {
          color: blue;
          font-weight: bold;
        }
        &.ERROR,
        &.FAILED {
          background-color: red;
          color: white;
        }
      }

      .request,
      .error,
      .response {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: 180px;
        &.cursor:hover {
          font-weight: bold;
        }
      }
    }

    .pagination-wrapper {
      justify-items: center;
    }
  }
`;
const MessageListPanel = ({
  type,
  title,
  reloadCount,
  createMsgFn,
  createMsgBtnProps
}: iMessageListPanel) => {
  const perPage = 10;
  const [messageList, setMessageList] = useState<iPaginatedResult<
    iMessage
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupContent, setPopupContent] = useState<any | null>(null);
  const [count, setCount] = useState(reloadCount || 0);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    MessageService.getMessages({
      where: JSON.stringify({
        type,
        isActive: true
      }),
      currentPage: `${currentPage}`,
      perPage: `${perPage}`,
      sort: "createdAt:DESC"
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setMessageList(resp);
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      });
  }, [type, currentPage, count]);

  const getPaginationBtns = () => {
    const windowSize = 7;
    const maxPageNo = messageList?.pages || 0;

    if (maxPageNo <= windowSize) {
      return _.range(1, maxPageNo);
    }

    if (
      currentPage >= MathHelper.sub(maxPageNo, MathHelper.div(windowSize, 2))
    ) {
      return _.range(
        MathHelper.sub(MathHelper.add(maxPageNo, 1), windowSize),
        MathHelper.add(maxPageNo, 1)
      );
    }

    let start =
      MathHelper.sub(currentPage, 2) < 1 ? 1 : MathHelper.sub(currentPage, 2);
    let end =
      MathHelper.add(start, windowSize) > maxPageNo
        ? MathHelper.add(maxPageNo, 1)
        : MathHelper.add(start, windowSize);
    return _.range(start, end);
  };

  const getPagination = () => {
    if (!messageList || messageList.pages <= 1) {
      return null;
    }

    return (
      <ButtonToolbar className={"pagination-wrapper"}>
        {currentPage <= 1 ? null : (
          <ButtonGroup>
            <Button variant={"link"} onClick={() => setCurrentPage(1)}>
              {"<<"}
            </Button>
            <Button
              variant={"link"}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              {"<"}
            </Button>
          </ButtonGroup>
        )}

        <ButtonGroup>
          {getPaginationBtns().map(index => {
            return (
              <Button
                key={index}
                variant={index === currentPage ? "primary" : "link"}
                onClick={() => setCurrentPage(index)}
              >
                {index}
              </Button>
            );
          })}
        </ButtonGroup>

        {currentPage >= messageList?.pages ? null : (
          <ButtonGroup>
            <Button
              variant={"link"}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {">"}
            </Button>
            <Button
              variant={"link"}
              onClick={() => setCurrentPage(messageList?.pages)}
            >
              {">>"}
            </Button>
          </ButtonGroup>
        )}
      </ButtonToolbar>
    );
  };

  const showPopupContent = () => {
    if (popupContent === null) {
      return null;
    }

    return (
      <PopupModal
        title={""}
        size={"lg"}
        show={popupContent !== null}
        handleClose={() => setPopupContent(null)}
        footer={
          <>
            <div />
            <Button variant={"primary"} onClick={() => setPopupContent(null)}>
              OK
            </Button>{" "}
          </>
        }
      >
        {popupContent}
      </PopupModal>
    );
  };

  const getCreateMsgBtn = () => {
    if (!createMsgFn) {
      return null;
    }
    return (
      <MessageCreatePopupBtn
        msgType={type}
        createMsgFn={createMsgFn}
        onMsgRefreshed={() => setCount(MathHelper.add(count, 1))}
        {...createMsgBtnProps}
      />
    );
  };

  const getContent = () => {
    if (isLoading) {
      return <Spinner animation={"border"} />;
    }
    return (
      <div className={"message-table-wrapper"}>
        <FlexContainer className={"with-gap lg-gap"}>
          <Button
            size={"sm"}
            variant={"link"}
            onClick={() => setCount(MathHelper.add(count, 1))}
          >
            <Icons.BootstrapReboot /> Refresh
          </Button>
          {getCreateMsgBtn()}
        </FlexContainer>
        <Table striped hover responsive className={"message-table"}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Request</th>
              <th>Response</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {messageList?.data.map(message => {
              return (
                <tr key={message.id}>
                  <td className={"date"}>
                    {moment(message.createdAt).format("lll")}
                  </td>
                  <td className={`status ${message.status?.toUpperCase()}`}>
                    {message.status}
                  </td>
                  <td
                    className={`request ${message.request ? "cursor" : ""}`}
                    onClick={() =>
                      setPopupContent(
                        message.request ? (
                          <pre>{JSON.stringify(message.request, null, 2)}</pre>
                        ) : (
                          ""
                        )
                      )
                    }
                  >
                    {message.request ? JSON.stringify(message.request) : ""}
                  </td>
                  <td
                    className={`response ${message.response ? "cursor" : ""}`}
                    onClick={() =>
                      setPopupContent(
                        message.response ? (
                          <pre>{JSON.stringify(message.response, null, 2)}</pre>
                        ) : (
                          ""
                        )
                      )
                    }
                  >
                    {message.response ? JSON.stringify(message.response) : ""}
                  </td>
                  <td
                    className={`error ${message.error ? "cursor" : ""}`}
                    onClick={() =>
                      setPopupContent(
                        message.error ? (
                          <pre>{JSON.stringify(message.error, null, 2)}</pre>
                        ) : (
                          ""
                        )
                      )
                    }
                  >
                    {message.error ? JSON.stringify(message.error) : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {getPagination()}
        {showPopupContent()}
      </div>
    );
  };

  return (
    <Wrapper>
      <div>{title || <p>List of logs for {type}</p>} </div>
      {getContent()}
    </Wrapper>
  );
};

export default MessageListPanel;
