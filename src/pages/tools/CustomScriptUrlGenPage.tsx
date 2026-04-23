import {Alert, Form, Button} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import React, {useEffect, useState} from 'react';
import {FlexContainer} from '../../styles';
import styled from 'styled-components';
import {THIRD_PARTY_AUTH_PATH} from '../../helper/SchoolBoxHelper';
import {Buffer} from 'buffer';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../services/Toaster';

const Wrapper = styled.div`
  .title-col {
    width: 160px;
  }
  
  .inputs {
    .form-control {
      &.not-main-input {
        background-color: transparent;
        border: none;
      }
    }
  }
`;

type iCustomScriptUrlGenPage = {
  customUrl: string;
  customUrlPath: string;
}
const CustomScriptUrlGenPage = ({customUrl, customUrlPath}: iCustomScriptUrlGenPage) => {
  const [currentBaseUrl, setCurrentBaseUrl] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [customAuthPath, setCustomAuthPath] = useState(THIRD_PARTY_AUTH_PATH);
  const [customPath, setCustomPath] = useState(customUrlPath);
  const [urlForSchoolBox, setUrlForSchoolBox] = useState('');
  const [customPathBased64, setCustomPathBased64] = useState('');
  const [customUrlBased64, setCustomUrlBased64] = useState('');


  useEffect(() => {
    const url = new URL(customUrl);
    setCustomBaseUrl(`${url.protocol}//${url.host}`)
  }, [customUrl])

  useEffect(() => {
    setCurrentBaseUrl(`${window.location.protocol}//${window.location.host}`)
  }, []);

  useEffect(() => {
    setCustomPathBased64(Buffer.from(customPath).toString('base64'));
  }, [customPath]);

  useEffect(() => {
    const url = `${customBaseUrl}${customAuthPath}/${customPathBased64}`;
    setCustomUrlBased64(url);
    const base64 = Buffer.from(url).toString('base64')
    setUrlForSchoolBox(`/modules/remote/${base64}`);
  }, [customPathBased64, customBaseUrl, customAuthPath])

  const copyToClickBoard = (text: string) => {
    navigator.clipboard.writeText(text);
    Toaster.showToast('Copied Successfully', TOAST_TYPE_SUCCESS)
  }

  return (
    <Wrapper>
      <h3>URL generator</h3>
      <Alert variant={'secondary'}>
        <Icons.ExclamationOctagonFill /> It's a tool to help administrators to generate custom url for SchoolBox. Those custom urls will be called in the side menu of the SchoolBox.
        It's built based on <a href={'https://help.schoolbox.com.au/homepage/503'} target={'__BLANK'}>SchoolBox Guide</a>.
      </Alert>

      <div className={'inputs'}>
        <FlexContainer className={'align-items center'}>
          <div className={'title-col'}>Base Url:</div>
          <Form.Control
            value={currentBaseUrl}
            className={'not-main-input'}
            onChange={(event) => setCurrentBaseUrl(event.target.value)}
          />
        </FlexContainer>

        <FlexContainer className={'align-items center'}>
          <div className={'title-col'}>Custom Script Url:</div>
          <FlexContainer className={'align-items center full-width'}>
            <Form.Control
              value={customBaseUrl}
              className={'not-main-input'}
              onChange={(event) => setCustomBaseUrl(event.target.value)}
            />
            <Form.Control
              value={customAuthPath}
              className={'not-main-input'}
              onChange={(event) => setCustomAuthPath(event.target.value)}
            />
            <Form.Control
              value={customPath}
              onChange={(event) => setCustomPath(event.target.value)}
            />
          </FlexContainer>
        </FlexContainer>
      </div>

      <FlexContainer className={'space-below'} />

      <Alert variant={'success'} className={'outputs'}>
        <Alert.Heading>
          Copy this one into SchoolBox
          <Button variant={'link'} size={'sm'} onClick={() => copyToClickBoard(urlForSchoolBox)}>
            <Icons.Clipboard />
          </Button>
        </Alert.Heading>
        <a href={urlForSchoolBox} target={'__BLANK'}>{urlForSchoolBox}</a>
      </Alert>

      <FlexContainer className={'align-items center with-gap space-below'}>
        <b>Custom Path after base64 encoded:</b>
        <div>{customPathBased64}</div>
      </FlexContainer>

      <FlexContainer className={'align-items center with-gap space-below'}>
        <b>Custom Url:</b>
        <a href={customUrlBased64} target={'__BLANK'}>{customUrlBased64}</a>
      </FlexContainer>

      <FlexContainer className={'align-items center with-gap '}>
        <b>Absolute Url:</b>
        <a href={`{currentBaseUrl}{urlForSchoolBox}`} target={'__BLANK'}>{currentBaseUrl}{urlForSchoolBox}</a>
      </FlexContainer>
    </Wrapper>
  )
}

export default CustomScriptUrlGenPage;
