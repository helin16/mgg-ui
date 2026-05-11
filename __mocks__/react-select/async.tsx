import React from 'react';

const AsyncSelect = (props: any) => {
  const handleLoad = async () => {
    const options = await props?.loadOptions?.('keyword');
    props?.onChange?.(Array.isArray(options) ? options[0] : null);
  };

  return (
    <div data-testid="AsyncReactSelectTestId">
      <button type="button" onClick={handleLoad}>Load Async Options</button>
      <button type="button" onClick={() => props?.onChange?.(null)}>Clear Async Selection</button>
    </div>
  );
};

export default AsyncSelect;
