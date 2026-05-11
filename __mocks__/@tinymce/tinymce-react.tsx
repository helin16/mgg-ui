import React, {useEffect} from 'react';

export const Editor = ({init, onChange, onEditorChange, initialValue}: any) => {
  useEffect(() => {
    const editor = {
      on: (eventName: string, cb: any) => {
        if (eventName === 'init') {
          cb();
        }
      },
    };
    init?.setup?.(editor);
  }, [init]);

  return (
    <div data-testid="TinyMceEditorTestId">
      <div>{initialValue || ''}</div>
      <button
        type="button"
        onClick={() => {
          onChange?.({target: {getContent: () => '<p>changed</p>'}});
          onEditorChange?.('<p>changed</p>', {});
        }}
      >
        Change Content
      </button>
    </div>
  );
};
