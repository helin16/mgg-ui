import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import TabPanel from '../../../components/common/TabPanel';

describe('TabPanel', () => {
  test('renders tabs and switches content when another tab is selected', () => {
    render(
      <TabPanel
        tabs={[
          {key: 'one', title: 'One', content: <div>First Content</div>},
          {key: 'two', title: 'Two', content: <div>Second Content</div>},
        ]}
      />
    );

    expect(screen.getByText('First Content')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', {name: 'Two'}));
    expect(screen.getByText('Second Content')).toBeInTheDocument();
  });
});
