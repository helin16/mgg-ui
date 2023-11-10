import styled from "styled-components";
import {useRef} from 'react';
import {Button} from 'react-bootstrap';
import Toaster, {TOAST_TYPE_ERROR} from '../../services/Toaster';

const Wrapper = styled.div`
  text-align: center;
  padding: 1rem;
  border: 1px #ccc dashed;
`;

export type iClientSlideFileAsset = {
  name: string;
  url: string;
  mimeType: string;
  size: number;
}

type iClientSideFileReader = {
  className?: string;
  isMulti?: boolean;
  title?: any;
  description?: any;
  onFinished: (files: iClientSlideFileAsset[]) => void;
};


const ClientSideFileReader = ({ className, isMulti, description, title, onFinished }: iClientSideFileReader) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      const newReadFiles: iClientSlideFileAsset[] = [];

      const processFile = (file: File) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const result = reader.result as string;
          newReadFiles.push({name: file.name, url: result, mimeType: file.type, size: file.size});

          if (newReadFiles.length === files.length) {
            if (onFinished) {
              onFinished(newReadFiles)
            }
          }
        };

        if (file.type.startsWith('image') || file.type === 'application/pdf') {
          reader.readAsDataURL(file);
        } else {
          Toaster.showToast(`Unsupported file type(${file.name}). Please select an image (png, jpg, gif) or a PDF file.`, TOAST_TYPE_ERROR);
        }
      };

      for (let i = 0; i < files.length; i++) {
        processFile(files[i]);
      }
    }
  }

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFileChange(files);
  };

  return (
    <Wrapper
      className={className}
      onDragOver={e => e.preventDefault()}
      onDrop={handleFileDrop}
    >
      {title || <h6>Drag and drop {isMulti === true ? 'your files' : 'your file'} here</h6>}
      <div className={'input-wrapper'}>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={e => e.target.files && handleFileChange(e.target.files)}
          style={{ display: "none" }}
          multiple={isMulti}
          ref={fileInputRef}
        />
        <Button variant={'outline-secondary'} className={'choosing-label'} size={'sm'} onClick={() => {
          // @ts-ignore
          fileInputRef.current && fileInputRef.current.click()
        }}>
          Click here to upload your {isMulti === true ? 'files' : 'file'}
        </Button>
      </div>
      {description}
    </Wrapper>
  );
};

export default ClientSideFileReader;
