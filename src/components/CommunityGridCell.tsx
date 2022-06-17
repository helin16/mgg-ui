import React, {ReactElement, useEffect, useState} from 'react';
import styled from 'styled-components';
import {Image, Spinner} from 'react-bootstrap';
import iSynCommunity from '../types/Synergetic/iSynCommunity';
import SynPhotoService from '../services/Synergetic/SynPhotoService';

type iCommunityGridCell = {
  communityProfile: iSynCommunity;
  caption?: ReactElement;
  onClick?: () => void;
}
const Wrapper = styled.div`
  .profile-image {
    min-height: 90px;
    min-width: 90px;
    width: 140px;
  }
  margin: 0.4rem;
  display: inline-block;
`
const CommunityGridCell = ({communityProfile, caption, onClick}: iCommunityGridCell) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');

  useEffect(() => {
    setIsLoading(true);
    SynPhotoService.getPhoto(communityProfile.ID)
      .then(resp => {
        setProfileUrl(SynPhotoService.convertBufferToUrl(resp.Photo.data))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [communityProfile])

  const handleOnClick = () => {
    if (!onClick) {
      return;
    }
    onClick();
  }

  const getImage = () => {
    if (isLoading === true) {
      return <Spinner animation={'border'} />
    }
    return (
      <Image src={profileUrl}
        className={`profile-image ${onClick !== undefined ? 'cursor' : ''}`}
        alt={`${communityProfile.Given1} ${communityProfile.Surname}`}
        onClick={handleOnClick}
      />
    )
  }

  return (
    <Wrapper className={`community-grid-cell `}>
      {getImage()}
      <div className={'caption'} onClick={handleOnClick}>
        {caption || <div><b>{communityProfile.Title} {communityProfile.Given1} {communityProfile.Surname}</b><div>{communityProfile.ID}</div></div>}
      </div>
    </Wrapper>
  )
}

export default CommunityGridCell;
