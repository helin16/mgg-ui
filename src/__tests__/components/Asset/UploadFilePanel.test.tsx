import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import UploadFilePanel, {MAX_FILE_SIZE} from '../../../components/Asset/UploadFilePanel';
import Toaster from '../../../services/Toaster';

jest.mock('../../../services/Toaster');
jest.mock('../../../services/UtilsService', () => ({
  __esModule: true,
  default: {
    formatBytesToHuman: jest.fn(() => '20 MB'),
  },
}));

describe('UploadFilePanel', () => {
  const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

  test('uploads selected files from the hidden input', () => {
    const uploadFn = jest.fn();
    render(<UploadFilePanel uploadFn={uploadFn} allowMultiple />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['hello'], 'photo.png', {type: 'image/png'});
    fireEvent.change(input, {
      target: {files: [file]},
    });

    expect(uploadFn).toHaveBeenCalledWith([file]);
  });

  test('filters oversized files and reports an error toast', () => {
    const uploadFn = jest.fn();
    render(<UploadFilePanel uploadFn={uploadFn} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const largeFile = new File(['hello'], 'large.pdf', {type: 'application/pdf'});
    Object.defineProperty(largeFile, 'size', {value: MAX_FILE_SIZE + 1});

    fireEvent.change(input, {
      target: {files: [largeFile]},
    });

    expect(mockedToaster.showToast).toHaveBeenCalled();
    expect(uploadFn).toHaveBeenCalledWith([]);
  });

  test('changes description while dragging files over the panel', () => {
    render(<UploadFilePanel uploadFn={jest.fn()} />);
    const wrapper = screen.getByText('Click to select file(s) or drag file(s) to here').closest('div')!;

    fireEvent.dragOver(wrapper);
    expect(screen.getByText('Drop them here to upload...')).toBeInTheDocument();

    fireEvent.dragLeave(wrapper);
    expect(screen.getByText('Click to select file(s) or drag file(s) to here')).toBeInTheDocument();
  });
});
