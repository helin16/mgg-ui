import iBTLockDown from '../../../types/BudgetTacker/iBTLockDown';
import {Alert} from 'react-bootstrap';
import moment from 'moment-timezone';
import styled from 'styled-components';

type iBTLockdownPanel = {
  btLockDown: iBTLockDown;
}

const Wrapper = styled.div`
  
`;
const BTLockdownPanel = ({btLockDown}: iBTLockdownPanel) => {
  const isPassed = () => {
    return moment(btLockDown.lockdown).isSameOrBefore(moment());
  }
  return (
    <Wrapper>
      <Alert variant={isPassed() ? 'danger' : 'info'}>
        <p className={'text-center'}>
          Budget Tracker for <b>{btLockDown.year}</b> {isPassed() ? 'has been' : 'will be'} locked down at
        </p>
        <h5 className={'text-center'}>
          {moment(btLockDown.lockdown).format('Do MMMM YYYY h:mm:ss a')}
        </h5>
        <p className={'text-center no-margin'}>You {isPassed() ? 'can NOT' : 'will NOT be able to'}  create or update any of the items after above time.</p>
      </Alert>
    </Wrapper>
  )
}

export default BTLockdownPanel;
