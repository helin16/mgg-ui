import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import RedPage from '../../layouts/RedPage';

jest.mock('../../components/SchoolCrest', () => {
  return function MockSchoolCrest() {
    return <div>School Crest</div>;
  };
});

jest.mock('../../layouts/Page', () => {
  return function MockPage(props: any) {
    return <div>{props.children}</div>;
  };
});

describe('RedPage', () => {
  test('renders children and updates document chrome', () => {
    const view = renderToStaticMarkup(
      <RedPage title="Red Screen">
        <div>Display</div>
      </RedPage>
    );

    expect(view).toContain('School Crest');
    expect(view).toContain('Display');
    expect(document.title).toBe('Red Screen');
    expect(document.body.style.color).toBe('white');
  });
});
