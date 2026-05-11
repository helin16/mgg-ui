import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import ClientSideFileReader from '../../../components/common/ClientSideFileReader';
import Toaster from '../../../services/Toaster';

jest.mock('../../../services/Toaster');

describe('ClientSideFileReader', () => {
  const originalFileReader = global.FileReader;

  beforeEach(() => {
    class MockFileReader {
      result: string | ArrayBuffer | null = 'data:image/png;base64,file';
      onloadend: null | (() => void) = null;

      readAsDataURL() {
        this.onloadend?.();
      }
    }

    // @ts-ignore
    global.FileReader = MockFileReader;
  });

  afterEach(() => {
    global.FileReader = originalFileReader;
  });

  test('reads supported files and returns them to the callback', async () => {
    const onFinished = jest.fn();
    const {container} = render(<ClientSideFileReader onFinished={onFinished} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'photo.png', {type: 'image/png'});

    fireEvent.change(input, {target: {files: [file]}});

    await waitFor(() => expect(onFinished).toHaveBeenCalledWith([
      expect.objectContaining({name: 'photo.png', mimeType: 'image/png'}),
    ]));
  });

  test('shows an error for unsupported file types', async () => {
    const {container} = render(<ClientSideFileReader onFinished={jest.fn()} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'notes.txt', {type: 'text/plain'});

    fireEvent.change(input, {target: {files: [file]}});

    await waitFor(() => expect(Toaster.showToast).toHaveBeenCalled());
  });
});
