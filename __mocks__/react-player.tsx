import React from 'react';

const ReactPlayer = React.forwardRef<any, any>((props, ref) => {
  if (typeof ref === 'function') {
    ref({});
  } else if (ref && 'current' in ref) {
    ref.current = {};
  }

  return <div data-testid="ReactPlayerTestId">{props?.url || ''}</div>;
});

export default ReactPlayer;
