import {useEffect, useState} from 'react';
import iMessage from '../../types/Message/iMessage';
import MessageService from '../../services/MessageService';
import Toaster from '../../services/Toaster';
import {Spinner, Table} from 'react-bootstrap';
import styled from 'styled-components';
import moment from 'moment-timezone';

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
`;
const MessageListPanel = ({type}: iMessageListPanel) => {

  const [messages, setMessages] = useState<iMessage[]>([]);
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
      sort: 'createdAt:DESC'
    }).then(resp => {
      if (isCanceled) { return }
      setMessages(resp.data);
    }).catch(err => {
      if (isCanceled) { return }
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) { return }
      setIsLoading(false);
    })
  }, [type, currentPage]);



  const getContent = () => {
    if (isLoading) {
      return <Spinner animation={'border'} />
    }
    return (
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
        {messages.map(message => {
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
