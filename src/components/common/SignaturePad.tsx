import styled from "styled-components";
import { useRef } from "react";
import SignatureCanvas, {
  ReactSignatureCanvasProps
} from "react-signature-canvas";
import {Button, Image} from "react-bootstrap";
import * as Icons from 'react-bootstrap-icons';

export type iSignatureCanvas = SignatureCanvas;

type iSignaturePad = {
  onSign?: (dataUrl: string) => void;
  onClear?: () => void;
  signature?: string;
  className?: string;
  isDisabled?: boolean;
  setCanvas?: (canvas: iSignatureCanvas | null) => void;
  canvasProps?: ReactSignatureCanvasProps;
};

const Wrapper = styled.div`
  max-width: 100% !important;
  position: relative;
  .signature-canvas {
    max-width: 100% !important;
    background-color: #eee;
    border: 1px #ddd solid;
  }
  
  img.signature-canvas {
    background-color: #ececec;
    border: none !important;
    object-fit: contain;
  }
  .clearBtns {
    position: absolute;
    top: 0px;
    left: 0px;
  }
`;
const SignaturePad = ({ onSign, canvasProps, signature, onClear, isDisabled, setCanvas, className }: iSignaturePad) => {
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleSave = () => {
    if (onSign && signatureRef.current) {
      const dataUrl = signatureRef.current.toDataURL();
      onSign(dataUrl);
      return;
    }
    setCanvas && setCanvas(signatureRef.current);
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
    onClear && onClear();
  };

  const getSignature = () => {
    // @ts-ignore
    const {width, height} = (canvasProps || {});
    const string = `${signature || ''}`.trim();
    if (string !== '' || isDisabled === true) {
      return (
        <Image src={string} className={'signature-canvas'} style={{width: width || 600, height: height || 300}}/>
      )
    }
    return (
      <>
        <SignatureCanvas
          penColor="black"
          onEnd={() => handleSave()}
          clearOnResize
          canvasProps={{
            width: 600,
            height: 300,
            className: "signature-canvas",
            ...canvasProps
          }}
          ref={signatureRef}
        />
      </>
    )
  }

  const getBtns = () => {
    if (isDisabled === true) {
      return null;
    }

    return (
      <div
        className={"clearBtns"}
      >
        <Button onClick={handleClear} variant={"outline-danger"} size={"sm"}>
          <Icons.XLg />
        </Button>
      </div>
    )
  }

  return (
    <Wrapper className={className}>
      {getSignature()}
      {getBtns()}
    </Wrapper>
  );
};

export default SignaturePad;
