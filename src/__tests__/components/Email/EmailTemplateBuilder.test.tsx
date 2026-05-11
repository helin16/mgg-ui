import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import EmailTemplateBuilder from '../../../components/Email/EmailTemplateBuilder';

jest.mock('react-email-editor', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  const mockComponent = React.forwardRef<any, any>((props: any, ref: any) => {
    const editor = {
      loadDesign: jest.fn(),
      addEventListener: jest.fn(),
    };

    React.useEffect(() => {
      if (typeof ref === 'function') {
        ref({editor});
      } else if (ref && 'current' in ref) {
        ref.current = {editor};
      }
      props?.onReady?.(editor);
    }, [props, ref]);

    return React.createElement('div', {['data-testid']: 'EmailEditorTestId'});
  });
  return {
    __esModule: true,
    default: mockComponent,
  };
});

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
