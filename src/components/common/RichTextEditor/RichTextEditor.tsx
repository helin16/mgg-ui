import {Editor} from '@tinymce/tinymce-react';
import styled from 'styled-components';

type iRichTextEditor = {
  value?: string;
  className?: string;
  height?: number;
  plugins?: string[];
  toolBar?: string;
  settings?: any;
  onChange?: (text: string) => void;
}

const defaultPlugins = [
  'advlist',
  'lists',
  'autolink',
  'link',
  'image',
  'charmap',
  'preview',
  // 'anchor',
  'searchreplace',
  'visualblocks',
  'code',
  'fullscreen',
  'insertdatetime',
  'media',
  'table',
  'code',
];
const defaultToolBars = [
  'undo redo',
  'bold italic underline strikethrough forecolor backcolor',
  'alignleft aligncenter alignright alignjustify',
  'bullist numlist',
  'outdent indent',
  'image media',
  'link',
  'removeformat fullscreen',
];
const Wrapper = styled.div`
  .tox-statusbar__branding {
    display: none;
  }
`;

const RichTextEditor = ({value, plugins, toolBar, settings, onChange, className, height = 450}: iRichTextEditor) => {
  // const editorRef = useRef(null);
  const baseUrl = window.location.protocol + '//' + window.location.host;
  console.log('baseUrl', baseUrl);
  return (
    <Wrapper className={className}>
      <Editor
        initialValue={value || ''}
        apiKey={process.env.REACT_APP_TINYMCE_API_KEY || ''}
        onChange={(editor) => onChange && onChange(editor.target.getContent())}
        init={{
          height,
          menubar: true,
          plugins: plugins || defaultPlugins,
          toolbar: toolBar || defaultToolBars.join('|'),
          removed_menuitems: 'newdocument',
          document_base_url: '',
          relative_urls: false,
          ...(settings || {}),
        }}
      />
    </Wrapper>
  )
}

export default RichTextEditor
