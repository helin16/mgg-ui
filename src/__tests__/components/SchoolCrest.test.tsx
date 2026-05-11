import React from 'react';
import {render, screen} from '@testing-library/react';
import SchoolCrest from '../../components/SchoolCrest';
import UtilsService from '../../services/UtilsService';

jest.mock('../../services/UtilsService', () => ({
  __esModule: true,
  default: {
    getFullUrl: jest.fn(),
  },
}));

describe('SchoolCrest', () => {
  test('renders the crest image using UtilsService', () => {
    (UtilsService.getFullUrl as jest.Mock).mockReturnValue('https://cdn/crest.png');

    render(<SchoolCrest alt="School Crest" />);

    expect(UtilsService.getFullUrl).toHaveBeenCalledWith('images/crest.png');
    expect(screen.getByAltText('School Crest')).toHaveAttribute('src', 'https://cdn/crest.png');
  });
});
