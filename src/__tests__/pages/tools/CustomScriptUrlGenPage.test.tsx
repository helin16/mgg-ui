import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import CustomScriptUrlGenPage from '../../../pages/tools/CustomScriptUrlGenPage';

describe('CustomScriptUrlGenPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    jest.spyOn(React, 'useEffect').mockImplementation(() => undefined);

    const {container} = render(
      <CustomScriptUrlGenPage
        customUrl="https://example.com/modules/remote"
        customUrlPath="/sample"
      />
    );

    expect(container).not.toBeEmptyDOMElement();
  });
});
