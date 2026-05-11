import React from 'react';
import {render, screen} from '@testing-library/react';
import UserAndDateTimePanel from '../../../components/common/UserAndDateTimePanel';

describe('UserAndDateTimePanel', () => {
  test('renders both user and date strings when present', () => {
    render(<UserAndDateTimePanel userString="Jane Doe" dateTimeString="11 May 2026" />);

    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    expect(screen.getByText(/11 May 2026/)).toBeInTheDocument();
  });

  test('renders nothing when both values are blank', () => {
    const {container} = render(<UserAndDateTimePanel userString="" dateTimeString="" />);

    expect(container).toBeEmptyDOMElement();
  });
});
