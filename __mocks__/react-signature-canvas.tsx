import React, {useImperativeHandle, useRef} from 'react';

const SignatureCanvas = React.forwardRef<any, any>((props, ref) => {
  const instanceRef = useRef({
    clear: jest.fn(),
    toDataURL: jest.fn(() => 'data:image/png;base64,signature'),
  });

  useImperativeHandle(ref, () => instanceRef.current, []);

  return (
    <div data-testid="SignatureCanvasTestId">
      <button type="button" onClick={() => props?.onEnd?.()}>Trigger Sign</button>
    </div>
  );
});

export default SignatureCanvas;
