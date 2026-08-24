import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeTableImportPopupBtn from '../../../components/timeTable/TimeTableImportPopupBtn';
import SynTimeTableService from '../../../services/Synergetic/SynTimeTableService';
import MessageService from '../../../services/MessageService';
import SynVConfigUserPermissionService from '../../../services/Synergetic/SynVConfigUserPermissionService';

jest.mock('react-redux', () => ({
  useSelector: (selector: any) => selector({auth: {user: {synergyId: 123}}}),
}));
jest.mock('../../../services/Synergetic/SynTimeTableService');
jest.mock('../../../services/MessageService');
jest.mock('../../../services/Synergetic/SynVConfigUserPermissionService');
jest.mock('../../../components/common/PopupModal', () => ({show, children, footer}: any) =>
  show ? <div>{children}{footer}</div> : null
);

describe('TimeTableImportPopupBtn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SynVConfigUserPermissionService.getAll as jest.Mock).mockResolvedValue({total: 1});
    (MessageService.getMessages as jest.Mock).mockResolvedValue({data: []});
    (SynTimeTableService.importTimeTable as jest.Mock).mockResolvedValue({});
  });

  test('includes TIMETABLERYDEXT in the default import request', async () => {
    const user = userEvent.setup();
    render(<TimeTableImportPopupBtn />);

    await waitFor(() => expect(screen.getByRole('button', {name: 'TimeTable Import'})).toBeEnabled());
    await user.click(screen.getByRole('button', {name: 'TimeTable Import'}));

    expect(await screen.findByText('TIMETABLERYDEXT')).toBeInTheDocument();
    await user.click(screen.getByRole('button', {name: 'Start Import'}));

    expect(SynTimeTableService.importTimeTable).toHaveBeenCalledWith({
      types: ['TIMETABLER', 'TIMETABLERYD', 'TIMETABLEREXT', 'TIMETABLERYDEXT'],
    });
  });
});
