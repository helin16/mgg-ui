import {Editor} from '@tinymce/tinymce-react';

type iRichTextEditor = {
  value?: string;
}
const RichTextEditor = ({value}: iRichTextEditor) => {
  return (
    <Editor
      // onInit={(evt, editor) => editorRef.current = editor}
      initialValue={value || ''}
      apiKey={'zvty66lu5oa806yvitzq0vno4jc5482kl8x22baopup3z4xg'}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
    />
  )
}

export default RichTextEditor
