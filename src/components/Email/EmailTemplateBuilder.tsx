import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import { useRef } from "react";
import styled from "styled-components";

type iEmailTemplateBuilder = {
  designData: any;
  editorRef: (editor: EditorRef | null) => void;
};

const Wrapper = styled.div``;
const EmailTemplateBuilder = ({
  designData,
  editorRef
}: iEmailTemplateBuilder) => {
  const emailEditorRef = useRef<EditorRef | null>(null);

  const onReady: EmailEditorProps["onReady"] = unlayer => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
    // emailEditorRef.current?.editor?.init({
    //   customCSS: [
    //     ".blockbuilder-branding {display: none !important;}"
    //   ]
    // })
    // const templateJson = { DESIGN JSON GOES HERE };
    editorRef(emailEditorRef?.current);
    if (Object.keys(designData).length > 0) {
      unlayer.loadDesign(designData);
    }
  };

  return (
    <Wrapper className={"email-builder"}>
      <EmailEditor
        ref={emailEditorRef}
        onReady={onReady}
        minHeight={'1200px'}
        options={{
          safeHtml: true,
          displayMode: 'email',
        }}
      />
    </Wrapper>
  );
};

export default EmailTemplateBuilder;
