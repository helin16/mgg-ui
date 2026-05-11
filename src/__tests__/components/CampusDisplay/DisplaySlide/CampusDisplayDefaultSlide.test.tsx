import React from 'react';
import {render, screen} from '@testing-library/react';
import CampusDisplayDefaultSlide from '../../../../components/CampusDisplay/DisplaySlide/CampusDisplayDefaultSlide';
import {CampusDisplaySlideCreatePopupBtnTestId} from '../../../../components/CampusDisplay/DisplaySlide/__mocks__/CampusDisplaySlideCreatePopupBtn';

jest.mock('../../../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideCreatePopupBtn');

describe('CampusDisplayDefaultSlide', () => {
  test('shows the default slide message and only renders new button when editable', () => {
    const {rerender} = render(<CampusDisplayDefaultSlide />);

    expect(screen.getByText('This is the default slide')).toBeInTheDocument();
    expect(screen.queryByTestId(CampusDisplaySlideCreatePopupBtnTestId)).not.toBeInTheDocument();

    rerender(<CampusDisplayDefaultSlide onSaved={jest.fn()} campusDisplay={{id: 'display-1'} as any} />);
    expect(screen.getByTestId(CampusDisplaySlideCreatePopupBtnTestId)).toBeInTheDocument();
  });
});
