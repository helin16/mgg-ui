import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import SignaturePad from '../../../components/common/SignaturePad';

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

describe('SignaturePad', () => {
  test('saves a signature when drawing ends and clears on request', () => {
    const onSign = jest.fn();
    const onClear = jest.fn();

    render(<SignaturePad onSign={onSign} onClear={onClear} />);

    fireEvent.click(screen.getByRole('button', {name: 'Trigger Sign'}));
    expect(onSign).toHaveBeenCalledWith('data:image/png;base64,signature');

    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(onClear).toHaveBeenCalled();
  });

  test('shows the saved signature image when disabled', () => {
    render(<SignaturePad signature="data:image/png;base64,saved" isDisabled />);

    expect(screen.getByRole('img')).toHaveAttribute('src', 'data:image/png;base64,saved');
  });
});
