import {useEffect, useState} from 'react';
import iMessage from '../../types/Message/iMessage';
import MessageService from '../../services/MessageService';
import Toaster from '../../services/Toaster';
import {Spinner, Table} from 'react-bootstrap';
import styled from 'styled-components';
import moment from 'moment-timezone';
import iPaginatedResult from '../../types/iPaginatedResult';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import * as _ from 'lodash';

type iMessageListPanel = {
  type: string;
}

const Wrapper = styled.div`
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
      &.ERROR {
        background-color: red;
        color: white;
      }
    }
  }
  .pagination-wrapper {
    justify-items: center;
  }
`;
const MessageListPanel = ({type}: iMessageListPanel) => {

  const perPage = 10;
  const [messageList, setMessageList] = useState<iPaginatedResult<iMessage> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    MessageService.getMessages({
      where: JSON.stringify({
        type
      }),
      currentPage: `${currentPage}`,
      perPage: `${perPage}`,
      sort: 'createdAt:DESC'
    }).then(resp => {
      if (isCanceled) { return }
      setMessageList(resp);
    }).catch(err => {
      if (isCanceled) { return }
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) { return }
      setIsLoading(false);
    })
  }, [type, currentPage]);


  const getPaginationBtns = () => {
    const maxPageNo = (messageList?.pages || 5);

    if (maxPageNo < 5 || currentPage < 3) {
      return _.range(1, maxPageNo + 1);
    }

    if (currentPage >= (maxPageNo - 2)) {
      return _.range(maxPageNo - 4, maxPageNo + 1);
    }
    return _.range(currentPage - 2, currentPage + 2);
  }


  const getPagination = () => {
    if (!messageList || messageList.pages <= 1) {
      return null;
    }

    return (
      <ButtonToolbar className={'pagination-wrapper'}>
        {currentPage <= 1 ? null : (
          <ButtonGroup>
            <Button variant={'link'} onClick={() => setCurrentPage(1)}>{'<<'}</Button>
            <Button variant={'link'} onClick={() => setCurrentPage(currentPage - 1)}>{'<'}</Button>
          </ButtonGroup>
        )}

        <ButtonGroup>
          {getPaginationBtns().map(index => {
            return (
              <Button
                variant={index === currentPage ? 'primary' : 'link'}
                onClick={() => setCurrentPage(index)}>
                {index}
              </Button>
            );
          })}
        </ButtonGroup>

        {currentPage >= messageList?.pages ? null : (
          <ButtonGroup>
            <Button variant={'link'} onClick={() => setCurrentPage(currentPage + 1)}>{'>'}</Button>
            <Button variant={'link'} onClick={() => setCurrentPage(messageList?.pages)}>{'>>'}</Button>
          </ButtonGroup>
        )}
      </ButtonToolbar>
    )
  }

  const getContent = () => {
    if (isLoading) {
      return <Spinner animation={'border'} />
    }
    return (
      <>
        <Table striped hover responsive className={'message-table'}>
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
              <tr>
                <td className={'date'}>{moment(message.createdAt).format('lll')}</td>
                <td className={`status ${message.status?.toUpperCase()}`}>{message.status}</td>
                <td className={`request`}>{message.request ? JSON.stringify(message.request) : ''}</td>
                <td className={`response`}>{message.response ? JSON.stringify(message.response) : ''}</td>
                <td className={`error`}>{message.error ? JSON.stringify(message.error) : ''}</td>
              </tr>
            );
          })}
          </tbody>
        </Table>
        {getPagination()}
      </>
    );
  }

  return(
    <Wrapper>
      <p>List of logs for {type}</p>
      {getContent()}
    </Wrapper>
  )
}

export default MessageListPanel
