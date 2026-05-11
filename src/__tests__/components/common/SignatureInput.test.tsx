import React from 'react';
import {render, screen} from '@testing-library/react';
import SignatureInput from '../../../components/common/SignatureInput';

jest.mock('react-signature-canvas', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  const mockComponent = React.forwardRef<any, any>((props: any, ref: any) => {
    const instanceRef = React.useRef({
      clear: jest.fn(),
      toDataURL: jest.fn(() => 'data:image/png;base64,signature'),
    });

    React.useImperativeHandle(ref, () => instanceRef.current, []);

    return React.createElement(
      'div',
      {['data-testid']: 'SignatureCanvasTestId'},
      React.createElement(
        'button',
        {type: 'button', onClick: () => props?.onEnd?.()},
        'Trigger Sign'
      )
    );
  });
  return {
    __esModule: true,
    default: mockComponent,
  };
});

describe('SignatureInput', () => {
  test('exposes the signature pad ref to the parent', () => {
    const setSignatureInputPad = jest.fn();

    render(<SignatureInput setSignatureInputPad={setSignatureInputPad} />);

    expect(screen.getByTestId('SignatureCanvasTestId')).toBeInTheDocument();
    expect(setSignatureInputPad).toHaveBeenCalled();
  });
});
