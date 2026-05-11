import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocalFilesTable from '../../../components/Asset/LocalFilesTable';
import UtilsService from '../../../services/UtilsService';

jest.mock('../../../components/common/Table');
jest.mock('../../../services/UtilsService', () => ({
  __esModule: true,
  default: {
    formatBytesToHuman: jest.fn(() => '1 KB'),
  },
}));

describe('LocalFilesTable', () => {
  test('renders file metadata and clear/delete actions', async () => {
    const onDelete = jest.fn();
    const onClear = jest.fn();
    const file = new File(['hello'], 'notes.txt', {type: 'text/plain'});
    Object.defineProperty(file, 'size', {value: 1024});

    render(
      <LocalFilesTable
        files={[file]}
        onDelete={onDelete}
        onClear={onClear}
      />
    );

    expect(screen.getByText('notes.txt')).toBeInTheDocument();
    expect(screen.getByText('text/plain')).toBeInTheDocument();
    expect(UtilsService.formatBytesToHuman).toHaveBeenCalledWith(1024);

    await userEvent.click(screen.getByRole('button'));
    expect(onDelete).toHaveBeenCalledWith(file);
  });

  test('hides itself when empty and hideWhenEmpty is true', () => {
    const {container} = render(<LocalFilesTable files={[]} />);
    expect(container.querySelector('table')).toBeNull();
  });
});
