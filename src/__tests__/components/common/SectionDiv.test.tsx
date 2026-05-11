import React from 'react';
import {render} from '@testing-library/react';
import SectionDiv from '../../../components/common/SectionDiv';

describe('SectionDiv', () => {
  test('renders title and children', () => {
    const {container} = render(<SectionDiv title="Section Title">Section Body</SectionDiv>);

    expect(container).toHaveTextContent('Section Title');
    expect(container).toHaveTextContent('Section Body');
  });
});
