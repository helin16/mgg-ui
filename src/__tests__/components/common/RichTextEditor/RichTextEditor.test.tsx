import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import RichTextEditor from '../../../../components/common/RichTextEditor/RichTextEditor';

jest.mock('@tinymce/tinymce-react', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  const Editor = ({init, onChange, onEditorChange, initialValue}: any) => {
    React.useEffect(() => {
      const editor = {
        on: (eventName: string, cb: any) => {
          if (eventName === 'init') {
            cb();
          }
        },
      };
      init?.setup?.(editor);
    }, [init]);

    return React.createElement(
      'div',
      {['data-testid']: 'TinyMceEditorTestId'},
      React.createElement('div', null, initialValue || ''),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => {
            onChange?.({target: {getContent: () => '<p>changed</p>'}});
            onEditorChange?.('<p>changed</p>', {});
          },
        },
        'Change Content'
      )
    );
  };
  return {
    __esModule: true,
    Editor,
  };
});
jest.mock('../../../../services/Toaster');

describe('RichTextEditor', () => {
  test('forwards content changes from the editor', () => {
    const onChange = jest.fn();
    const onEditorChange = jest.fn();

    render(<RichTextEditor value="<p>initial</p>" onChange={onChange} onEditorChange={onEditorChange} />);

    fireEvent.click(screen.getByRole('button', {name: 'Change Content'}));

    expect(onChange).toHaveBeenCalledWith('<p>changed</p>');
    expect(onEditorChange).toHaveBeenCalledWith('<p>changed</p>', expect.anything());
  });
});
