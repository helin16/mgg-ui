import React from 'react';

const HighchartsReact = (props: any) => {
  return <div data-testid="HighchartsReactTestId">{props?.containerProps?.children || null}</div>;
};

export default HighchartsReact;
