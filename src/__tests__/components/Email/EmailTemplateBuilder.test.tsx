import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import EmailTemplateBuilder from '../../../components/Email/EmailTemplateBuilder';

jest.mock('react-email-editor', () => require('../../../../__mocks__/react-email-editor'));

describe('EmailTemplateBuilder', () => {
  test('loads the design and wires the editor callbacks when ready', async () => {
    const editorRef = jest.fn();
    const onUpdated = jest.fn();
    const designData = {body: {rows: []}};

    render(
      <EmailTemplateBuilder
        designData={designData}
        editorRef={editorRef}
        onUpdated={onUpdated}
      />
    );

    expect(screen.getByTestId('EmailEditorTestId')).toBeInTheDocument();

    await waitFor(() => expect(editorRef).toHaveBeenCalled());
  });
});
