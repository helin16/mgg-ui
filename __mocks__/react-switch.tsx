import React from 'react';

const Switch = ({checked, onChange, disabled}: any) => {
  return (
    <button
      type="button"
      data-testid="ReactSwitchTestId"
      aria-pressed={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
    >
      {checked ? 'On' : 'Off'}
    </button>
  );
};

export default Switch;
