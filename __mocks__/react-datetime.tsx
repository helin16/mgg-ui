import React from 'react';

const Datetime = ({onChange, renderInput, inputProps, value, ...props}: any) => {
  const renderedInputProps = {
    className: 'datetime-input',
    value: value || '',
    onChange: (event: any) => onChange?.(event.target.value),
    ...inputProps,
  };

  if (renderInput) {
    return (
      <div data-testid="DatetimeTestId">
        {renderInput(renderedInputProps)}
        <button type="button" onClick={() => onChange?.('2026-05-11T10:00:00')}>Pick Date</button>
      </div>
    );
  }

  return (
    <div data-testid="DatetimeTestId">
      <input {...renderedInputProps} />
      <button type="button" onClick={() => onChange?.('2026-05-11T10:00:00')}>Pick Date</button>
    </div>
  );
};

export default Datetime;
