import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import styled from 'styled-components';
import {ReactElement} from 'react';
import CommunityGridCell from '../../../components/CommunityGridCell';

type iPickupPageLayout = {
  communityProfile: iSynCommunity;
  children: ReactElement;
  actionBtns?: ReactElement;
}

const Wrapper = styled.div`
  .tableView {
    min-height: calc(100vh - 100px);
  }
  .details {
    text-align: left;
    width: 75%;
  }
`
const PickupPageLayout = ({communityProfile, children, actionBtns}: iPickupPageLayout) => {

  const getActionBtns = () => {
    if (!actionBtns) { return null}
    return <div className={'action-btns-wrapper'}>{actionBtns}</div>
  }
  return <Wrapper className={'pickup-page-layout'}>
    <div className={'flexbox space-between align-items-stretch'}>
      <div><CommunityGridCell communityProfile={communityProfile} /></div>
      <div className={'details'}>
        {children}
        {getActionBtns()}
      </div>
    </div>
  </Wrapper>
}

export default PickupPageLayout
