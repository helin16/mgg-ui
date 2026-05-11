import React from 'react';
import {render, screen} from '@testing-library/react';
import PanelTitle from '../../components/PanelTitle';

describe('PanelTitle', () => {
  test('renders the children with the panel-title class', () => {
    render(<PanelTitle className="extra-class">Finance</PanelTitle>);

    const title = screen.getByText('Finance');
    expect(title).toHaveClass('panel-title');
    expect(title).toHaveClass('extra-class');
  });
});
