import React from 'react';
import {render, screen} from '@testing-library/react';
import SchoolBoxDebugInfo from '../../../layouts/SchoolBox/SchoolBoxDebugInfo';

describe('SchoolBoxDebugInfo', () => {
  const originalDebug = process.env.REACT_APP_DEBUG;

  afterEach(() => {
    process.env.REACT_APP_DEBUG = originalDebug;
  });

  test('renders nothing when debug mode is disabled', () => {
    process.env.REACT_APP_DEBUG = 'false';
    const {container} = render(
      <SchoolBoxDebugInfo remoteUrl="https://sb" path="/finance" searchParams={{synId: '1'}} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('renders debug details when debug mode is enabled', () => {
    process.env.REACT_APP_DEBUG = 'true';
    render(
      <SchoolBoxDebugInfo
        remoteUrl="https://sb"
        path="/finance"
        searchParams={{synId: '1', schoolBoxUser: 'user'}}
      />
    );

    expect(screen.getByText('remoteUrl:')).toBeInTheDocument();
    expect(screen.getByText('https://sb')).toBeInTheDocument();
    expect(screen.getByText('finalPath:')).toBeInTheDocument();
    expect(screen.getByText('/finance')).toBeInTheDocument();
    expect(
      screen.getByText('searchParams: {"synId":"1","schoolBoxUser":"user"}')
    ).toBeInTheDocument();
  });
});
