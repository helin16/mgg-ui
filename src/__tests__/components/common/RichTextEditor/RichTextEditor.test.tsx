import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import RichTextEditor from '../../../../components/common/RichTextEditor/RichTextEditor';

jest.mock('@tinymce/tinymce-react', () => require('../../../../../__mocks__/@tinymce/tinymce-react'));
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
