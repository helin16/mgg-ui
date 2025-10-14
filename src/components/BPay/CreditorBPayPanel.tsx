import styled from 'styled-components';
import ExplanationPanel from '../ExplanationPanel';

const Wrapper = styled.div``
const CreditorBPayPanel = () => {

  return (
    <Wrapper>
      <ExplanationPanel variant={'info'} text={<>This tools is designed to create BPay Batch File (.bpb) file, based on <a href={'https://mentonegirls.atlassian.net/wiki/spaces/IP/pages/1713078273/Bpay+Batch+Processing'}>Instructions</a></>} />
    </Wrapper>
  )
}

export default CreditorBPayPanel
