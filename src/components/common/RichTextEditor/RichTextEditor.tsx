import {Editor} from '@tinymce/tinymce-react';

type iRichTextEditor = {
  value?: string;
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
  'link',
  'removeformat fullscreen',
];
const RichTextEditor = ({value, plugins, toolBar, settings, onChange, height = 450}: iRichTextEditor) => {
  // const editorRef = useRef(null);
  return (
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
        ...(settings || {})
      }}
    />
  )
}

export default RichTextEditor
