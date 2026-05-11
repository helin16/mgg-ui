import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import LinkBtn from '../../../components/common/LinkBtn';

describe('LinkBtn', () => {
  test('calls the click handler', () => {
    const onClick = jest.fn();

    render(<LinkBtn onClick={onClick}>Open Link</LinkBtn>);

    fireEvent.click(screen.getByText('Open Link'));
    expect(onClick).toHaveBeenCalled();
  });
});
