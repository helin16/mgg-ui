import React from 'react';

const Select = (props: any) => {
  return (
    <div data-testid="ReactSelectTestId">
      <button type="button" onClick={() => props?.onChange?.(props?.options?.[0] || null)}>
        Select First Option
      </button>
      <button type="button" onClick={() => props?.onChange?.(null)}>
        Clear Selection
      </button>
      {props?.value ? <div>{Array.isArray(props.value) ? props.value.map((v: any) => v?.label || v?.value).join(',') : props.value?.label || props.value?.value}</div> : null}
    </div>
  );
};

export default Select;
