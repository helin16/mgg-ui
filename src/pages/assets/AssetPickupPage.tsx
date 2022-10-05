import RedPage from '../../layouts/RedPage';
import styled from 'styled-components';
import {Container} from 'react-bootstrap';
import SchoolLogo from '../../components/SchoolLogo';
import SearchPanel from './components/SearchPanel';
import React, {useState} from 'react';
import iSynCommunity from '../../types/Synergetic/iSynCommunity';
import AssetPickupConfirm from './components/AssetPickupConfirm';

const Wrapper = styled.div`
  margin-top: 2rem;
  .content-wrapper {
    background: rgb(255, 255, 255, 0.7);
    color: #1a1e21;
    border-radius: .4rem;
    width: 80%;
    padding: 1rem;
    margin: auto;
    text-align: center;
    
    .school-logo {
      width: 130px;
      height: auto;
    }
    
    .content {
      padding: 2rem 1.4rem;
    }
  }
`
const AssetPickupPage = () => {
  const [selectedProfile, setSelectedProfile] = useState<iSynCommunity | null>(null);
  const getContent = () => {
    if (selectedProfile === null) {
      return (
        <>
          <SchoolLogo className={'school-logo space bottom'}/>
            <div className={'content'}>
            <div>
              <h4>You are picking up device(s) / equipment(s) for:</h4>
              <p>Please search profile by ID or email</p>
            </div>
            <SearchPanel onSelect={(profile: iSynCommunity) => setSelectedProfile(profile)}/>
          </div>
        </>
      )
    }
    return (
      <AssetPickupConfirm clearSelectedProfile={() => setSelectedProfile(null)} selectedProfile={selectedProfile} />
    );
  }

  return (
    <RedPage title={'IT Pickup'}>
      <Wrapper>
        <Container fluid className={'content-wrapper'}>
          {getContent()}
        </Container>
      </Wrapper>
    </RedPage>
  )
}

export default AssetPickupPage
