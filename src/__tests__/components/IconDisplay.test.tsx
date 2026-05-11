import React from 'react';
import {render} from '@testing-library/react';
import IconDisplay from '../../components/IconDisplay';

describe('IconDisplay', () => {
  test('renders the requested icon when the name exists', () => {
    const {container} = render(<IconDisplay name="Alarm" className="known-icon" />);

    expect(container.querySelector('svg.known-icon')).not.toBeNull();
  });

  test('falls back to the default icon when the name does not exist', () => {
    const known = render(<IconDisplay name="Alarm" className="known-icon" />).container.innerHTML;
    const unknown = render(<IconDisplay name="MissingIcon" className="fallback-icon" />).container.innerHTML;

    expect(unknown).toContain('fallback-icon');
    expect(unknown).not.toEqual(known);
  });
});
