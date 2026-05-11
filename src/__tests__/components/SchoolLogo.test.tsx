import React from 'react';
import {render, screen} from '@testing-library/react';
import SchoolLogo from '../../components/SchoolLogo';
import UtilsService from '../../services/UtilsService';

jest.mock('../../services/UtilsService', () => ({
  __esModule: true,
  default: {
    getFullUrl: jest.fn(),
  },
}));

describe('SchoolLogo', () => {
  test('renders the logo image using UtilsService', () => {
    (UtilsService.getFullUrl as jest.Mock).mockReturnValue('https://cdn/logo.png');

    render(<SchoolLogo alt="School Logo" />);

    expect(UtilsService.getFullUrl).toHaveBeenCalledWith('images/mentone-logo-text.png');
    expect(screen.getByAltText('School Logo')).toHaveAttribute('src', 'https://cdn/logo.png');
  });
});
