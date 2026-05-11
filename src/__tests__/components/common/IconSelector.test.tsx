import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import IconSelector from '../../../components/common/IconSelector';

jest.mock('../../../components/common/PopupModal');

describe('IconSelector', () => {
  test('opens the icon picker and selects a filtered icon', () => {
    const onIconSelected = jest.fn();

    render(<IconSelector onIconSelected={onIconSelected}>Pick Icon</IconSelector>);

    fireEvent.click(screen.getByRole('button', {name: 'Pick Icon'}));
    fireEvent.click(screen.getByRole('button', {name: /Activity/i}));

    expect(onIconSelected).toHaveBeenCalledWith(expect.objectContaining({name: 'Activity'}));
  });
});
