import styled from 'styled-components';

type iUserAndDateTimePanel = {
  userString?: string;
  userTitle?: any;
  dateTimeString?: string;
  dateTimeTitle?: any;
}

const Wrapper = styled.div``;
const UserAndDateTimePanel = ({userTitle, dateTimeTitle, userString, dateTimeString}: iUserAndDateTimePanel) => {
  if (`${userString || ''}`.trim() === '' && `${dateTimeString || ''}`.trim() === '') {
    return null;
  }

  const getUser = () => {
    if (`${userString || ''}`.trim() === '') {
      return null;
    }
    return <div>{userTitle || <b>By</b>} {userString}</div>
  }

  const getDateTime = () => {
    if (`${dateTimeString || ''}`.trim() === '') {
      return null;
    }
    return <div>{dateTimeTitle || <b>@</b>} {`${dateTimeString || ''}`.trim()}</div>
  }


  return (
    <Wrapper>
      {getUser()}
      {getDateTime()}
    </Wrapper>
  )
}

export default UserAndDateTimePanel
