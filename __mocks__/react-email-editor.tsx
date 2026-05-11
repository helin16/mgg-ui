import React, {useEffect} from 'react';

export type EditorRef = {
  editor: any;
} | null;

export type EmailEditorProps = {
  onReady?: (editor: any) => void;
};

const EmailEditor = React.forwardRef<any, any>((props, ref) => {
  const editor = {
    loadDesign: jest.fn(),
    addEventListener: jest.fn(),
  };

  useEffect(() => {
    if (typeof ref === 'function') {
      ref({editor});
    } else if (ref && 'current' in ref) {
      ref.current = {editor};
    }
    props?.onReady?.(editor);
  }, [props, ref]);

  return <div data-testid="EmailEditorTestId" />;
});

export default EmailEditor;
