import React from 'react';
import {render, screen} from '@testing-library/react';
import CDSlideDisplayModeSelector, {
  CD_DISPLAY_MODE_FULL_SCREEN_FILL,
  CD_DISPLAY_MODE_FULL_SCREEN_FIT,
} from '../../../../components/CampusDisplay/DisplaySlide/CDSlideDisplayModeSelector';

describe('CDSlideDisplayModeSelector', () => {
  test('renders the built-in display mode options', () => {
    render(<CDSlideDisplayModeSelector value={CD_DISPLAY_MODE_FULL_SCREEN_FIT} onChange={jest.fn()} />);

    expect(screen.getByText('Full Screen Fit')).toBeInTheDocument();
    expect(CD_DISPLAY_MODE_FULL_SCREEN_FIT).toBe('fullscreen_contain');
    expect(CD_DISPLAY_MODE_FULL_SCREEN_FILL).toBe('fullscreen_cover');
  });
});
