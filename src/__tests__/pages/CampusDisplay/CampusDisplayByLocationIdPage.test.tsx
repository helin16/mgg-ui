import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import CampusDisplayByLocationIdPage from '../../../pages/CampusDisplay/CampusDisplayByLocationIdPage';
import {URL_CAMPUS_DISPLAY_SLIDE_SHOW_BY_LOCATION_PAGE} from '../../../Url';
import {
  CampusDisplaySlideShowByLocationIdKey,
  CampusDisplaySlideShowByLocationIdTestId,
} from '../../../components/CampusDisplay/DisplaySlide/__mocks__/CampusDisplaySlideShowByLocationId';

jest.mock(
  '../../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideShowByLocationId'
);

describe('CampusDisplayByLocationIdPage', () => {
  ComponentTestHelper.prepare();

  test('renders slideshow page composition with route params', () => {
    render(
      <MemoryRouter
          initialEntries={['/cd/loc/42']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
      >
        <Routes>
          <Route
            path={URL_CAMPUS_DISPLAY_SLIDE_SHOW_BY_LOCATION_PAGE}
            element={<CampusDisplayByLocationIdPage />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByTestId(CampusDisplaySlideShowByLocationIdTestId)
    ).toBeInTheDocument();

    expect(
      ComponentTestHelper.get(CampusDisplaySlideShowByLocationIdKey)
    ).toEqual([
      expect.objectContaining({
        locationId: '42',
        onCancel: expect.any(Function),
        onLocationLoaded: expect.any(Function),
      }),
    ]);

    const [slideshowProps] = ComponentTestHelper.get(
      CampusDisplaySlideShowByLocationIdKey
    );

    slideshowProps.onLocationLoaded({name: 'Senior Hall', version: 7});

    expect(document.title).toBe('CD Location: Senior Hall (7)');
  });
});
