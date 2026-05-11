import React from 'react';
import {render, screen} from '@testing-library/react';
import PopoverLayer from '../../../components/common/PopoverLayer';

describe('PopoverLayer', () => {
  test('renders its child trigger', () => {
    render(
      <PopoverLayer header="Header" body="Body" triggerProps={{trigger: 'click'}}>
        <button type="button">Open Popover</button>
      </PopoverLayer>
    );

    expect(screen.getByRole('button', {name: 'Open Popover'})).toBeInTheDocument();
  });
});
