import {Editor} from '@tinymce/tinymce-react';
import styled from 'styled-components';
import Toaster from '../../../services/Toaster';
import {useState} from 'react';
import iAsset from '../../../types/asset/iAsset';
import {Spinner} from 'react-bootstrap';

type iRichTextEditor = {
  value?: string;
  className?: string;
  height?: number;
  plugins?: string[];
  toolBar?: string;
  settings?: any;
  onChange?: (text: string) => void;
  onEditorChange?: (content: any, editor: any) => void;
  imagesUploadFn?: (blobInfo: any) => Promise<iAsset>;
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
  'formatpainter',
];
const defaultToolBars = [
  'undo redo',
  'bold italic underline strikethrough forecolor backcolor formatpainter',
  'alignleft aligncenter alignright alignjustify',
  'bullist numlist',
  'outdent indent',
  'image media',
  'link',
  'removeformat fullscreen',
];
const Wrapper = styled.div`
  position: relative;
  .tox-statusbar__branding {
    display: none;
  }
  
  .loading-mask {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
    display: block;
    background-color: rgba(100, 100, 100, 0.65);
    z-index: 999;
    .txt {
      margin: 30% auto;
      display: block;
      color: white;
      width: 4rem;
      text-align: center;
    }
  }
`;

const RichTextEditor = ({value, plugins, toolBar, settings, onChange, className, onEditorChange, imagesUploadFn, height = 450}: iRichTextEditor) => {
  // const editorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const getImageUploadSettings = () => {
    if (!imagesUploadFn) {
      return {};
    }
    return ({
      // media_dimensions: false, // Disable automatic video size detection
      images_upload_handler: (blobInfo: any, success: (msg: any) => void) => {
        setIsLoading(true);
        return imagesUploadFn(blobInfo)
          .then(resp => {
            const imgUrl = `${resp.url || ''}`.trim();
            success(imgUrl);
            return imgUrl;
          })
          .catch(error => {
            Toaster.showApiError(error);
          })
          .finally(() => {
            setIsLoading(false);
          })
      },
    })
  }

  const getIsLoadingDiv = () => {
    if (isLoading !== true) {
      return null;
    }
    return (
      <div className={'loading-mask'}>
        <div className={'txt'}>
          <Spinner animation={'border'} />
          <h5>Loading...</h5>
        </div>
      </div>
    )
  }

  return (
    <Wrapper className={className}>
      <Editor
        initialValue={value || ''}
        apiKey={process.env.REACT_APP_TINYMCE_API_KEY || ''}
        onChange={(editor) => onChange && onChange(editor.target.getContent())}
        onEditorChange={(content: any, editor: any) => onEditorChange && onEditorChange(content, editor)}
        init={{
          height,
          menubar: true,
          plugins: plugins || defaultPlugins,
          toolbar: toolBar || defaultToolBars.join('|'),
          removed_menuitems: 'newdocument',
          document_base_url: '',
          relative_urls: false,
          setup: (editor) => {
            editor.on('init', () => {
              // Set isLoading to false when TinyMCE is initialized
              setIsLoading(false);
            });
          },
          ...getImageUploadSettings(),
          ...(settings || {}),
        }}
      />
      {getIsLoadingDiv()}
    </Wrapper>
  )
}

export default RichTextEditor
