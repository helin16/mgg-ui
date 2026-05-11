import React from 'react';
import {render, screen} from '@testing-library/react';
import Panel from '../../../components/common/Panel';

describe('Panel', () => {
  test('renders the title and body', () => {
    render(<Panel title="Summary">Body Content</Panel>);

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Body Content')).toBeInTheDocument();
  });
});
