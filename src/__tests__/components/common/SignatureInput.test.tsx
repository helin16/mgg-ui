import React from 'react';
import {render, screen} from '@testing-library/react';
import SignatureInput from '../../../components/common/SignatureInput';

jest.mock('react-signature-canvas', () => require('../../../../__mocks__/react-signature-canvas'));

describe('SignatureInput', () => {
  test('exposes the signature pad ref to the parent', () => {
    const setSignatureInputPad = jest.fn();

    render(<SignatureInput setSignatureInputPad={setSignatureInputPad} />);

    expect(screen.getByTestId('SignatureCanvasTestId')).toBeInTheDocument();
    expect(setSignatureInputPad).toHaveBeenCalled();
  });
});
