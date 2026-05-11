import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import SelectBox from '../../../components/common/SelectBox';

jest.mock('react-select', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) => {
      return React.createElement(
        'div',
        {['data-testid']: 'ReactSelectTestId'},
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => props?.onChange?.(props?.options?.[0] || null),
        },
        'Select First Option'
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => props?.onChange?.(null),
        },
        'Clear Selection'
      ),
      props?.value
        ? React.createElement(
            'div',
            null,
            Array.isArray(props.value)
              ? props.value.map((v: any) => v?.label || v?.value).join(',')
              : props.value?.label || props.value?.value
          )
        : null
      );
    },
  };
});

describe('SelectBox', () => {
  test('passes selection changes through the wrapped select', () => {
    const onChange = jest.fn();

    render(
      <SelectBox
        options={[{value: 'a', label: 'Option A'}]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('button', {name: 'Select First Option'}));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({value: 'a'}));
  });
});
