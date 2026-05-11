import React from 'react';
import {render} from '@testing-library/react';
import ExplanationTooltip from '../../../components/common/ExplanationTooltip';

describe('ExplanationTooltip', () => {
  test('renders the tooltip trigger icon', () => {
    const {container} = render(<ExplanationTooltip description="Helpful text" />);

    expect(container.querySelector('svg')).toBeTruthy();
  });
});
