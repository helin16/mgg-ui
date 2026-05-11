import React from 'react';
import {render, screen} from '@testing-library/react';
import CampusDisplaySlideShow from '../../../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideShow';
import {CampusDisplayShowSlideTestId} from '../../../../components/CampusDisplay/DisplaySlide/__mocks__/CampusDisplayShowSlide';

jest.mock('../../../../components/CampusDisplay/DisplaySlide/CampusDisplayShowSlide');

describe('CampusDisplaySlideShow', () => {
  test('shows the default slide when there are no slides', () => {
    render(<CampusDisplaySlideShow slides={[]} />);

    expect(screen.getByText('This is the default slide')).toBeInTheDocument();
  });

  test('renders the slide carousel items for slides', () => {
    render(<CampusDisplaySlideShow slides={[{id: 'slide-1'}] as any} />);

    expect(screen.getByTestId(CampusDisplayShowSlideTestId)).toBeInTheDocument();
  });
});
