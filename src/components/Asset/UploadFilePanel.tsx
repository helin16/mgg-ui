import styled from 'styled-components';
import React, {useRef, useState} from 'react';


const Wrapper = styled.div`
  text-align: center;
  border: 1px #ccc dashed;
  padding: 1rem;

  &.is-dragging-over {
    border-width: 3px;
    background-color: #86AF69;
    color: white;
  }
`;

type iUploadFilePanel = {
  className?: string;
  description?: any;
  acceptFileTypes?: string[];
  allowMultiple?: boolean;
  uploadFn: (files: File[]) => void;
}
const UploadFilePanel = ({
  description,
  uploadFn,
  className,
  allowMultiple = false,
  acceptFileTypes = []
}: iUploadFilePanel) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleSelectedFiles = (fileList: FileList) => {
    if (fileList.length <= 0) {
      return;
    }
    const allowTypes = (acceptFileTypes || []).map(type => `${type || ''}`.trim().toLowerCase()).filter(type => type !== '');
    const isMatchingExtensions = allowTypes.filter(type => type.startsWith('.')).length > 0;
    const files = Array.from(fileList)
      .filter(file => {
        if (allowTypes?.length <= 0) {
          return true;
        }

        if (isMatchingExtensions === true) {
          return allowTypes?.filter(type => `${file.name}`.toLowerCase().endsWith(type)).length >= 0 ;
        }

        const types = allowTypes.map(type => type.replace('*', ''));
        return types.filter(type => {
          return `${file.type}`.toLowerCase().startsWith(type)
        }).length > 0 ;
      });

    uploadFn(files);
  }

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    handleSelectedFiles(event.target.files || [])
  };

  const handleFileSelect = () => {
    // @ts-ignore
    fileInputRef.current.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();

    setIsDraggingOver(false);
    handleSelectedFiles(event.dataTransfer.files)
  };

  const getDescription = () => {
    if (isDraggingOver === true) {
      return <div>Drop them here to upload...</div>;
    }

    if (!description) {
      return <div>Click to select file(s) or drag file(s) to here</div>;
    }

    return description;
  }

  return (
    <Wrapper
      className={`cursor-pointer ${className || ""} ${isDraggingOver === true ? 'is-dragging-over' : ''}`}
      onClick={handleFileSelect}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={'description'}>{getDescription()}</div>
      <input
        type="file"
        accept={
          acceptFileTypes?.length > 0 ? acceptFileTypes.join(", ") : undefined
        }
        ref={fileInputRef}
        multiple={allowMultiple}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
    </Wrapper>
  );
};

export default UploadFilePanel
