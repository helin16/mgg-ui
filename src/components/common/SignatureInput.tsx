import SignatureCanvas, {ReactSignatureCanvasProps} from 'react-signature-canvas';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import ReactSignatureCanvas from 'react-signature-canvas';
import {Button} from 'react-bootstrap';

const Wrapper = styled.div`
  background: white;
  display: inline-block;
  position: relative;
  .clear-btn {
    position: absolute;
    top: 0px;
    right: 0px;
  }
`;

type iSignatureInput = {
  canvasProps?: ReactSignatureCanvasProps;
  className?: string;
  setSignatureInputPad: (pad: ReactSignatureCanvas | null) => void;
}
const SignatureInput = ({canvasProps, className, setSignatureInputPad}: iSignatureInput) => {
  const [signaturePad, setSignaturePad] = useState<ReactSignatureCanvas | null>(null);

  useEffect(() => {
    setSignatureInputPad(signaturePad)
  }, [signaturePad, setSignatureInputPad])

  const getClearBtn = () => {
    if (!signaturePad) {
      return null;
    }
    return <Button size={'sm'} variant={'light'} className={'clear-btn'} onClick={() => signaturePad?.clear()}>Clear</Button>
  }

  return (
    <Wrapper className={`signature-input-wrapper ${className}`}>
      {getClearBtn()}
      <SignatureCanvas
        penColor='black'
        ref={(ref) => { setSignaturePad(ref) }}
        canvasProps={{width: 420, height: 200, className: 'signature-input', ...canvasProps}} />
    </Wrapper>
  );
}

export default SignatureInput;
