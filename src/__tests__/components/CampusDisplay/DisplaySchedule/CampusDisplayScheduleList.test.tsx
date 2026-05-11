import React from 'react';
import {render, screen} from '@testing-library/react';
import CampusDisplayScheduleList from '../../../../components/CampusDisplay/DisplaySchedule/CampusDisplayScheduleList';
import {setUseListCrudHookMock} from '../../../../components/hooks/useListCrudHook/useListCrudHook';
import {TableTestId} from '../../../../components/common/__mocks__/Table';
import UtilsService from '../../../../services/UtilsService';
import TestHelper from '../../../helper/TestHelper';

jest.mock('../../../../components/hooks/useListCrudHook/useListCrudHook');
jest.mock('../../../../components/common/PageLoadingSpinner');
jest.mock('../../../../components/CampusDisplay/DisplaySchedule/CampusDisplayScheduleEditPopupBtn');
jest.mock('../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn');
jest.mock('../../../../components/common/Table');

describe('CampusDisplayScheduleList', () => {
  test('renders current and past schedule groups', () => {
    const now = new Date();
    const currentDate = new Date(now.getTime() + 86400000).toISOString();
    const pastDate = new Date(now.getTime() - 86400000 * 2).toISOString();
    const fakeName = TestHelper.faker.company.name();
    jest.spyOn(UtilsService, 'getWeekDaysShort').mockReturnValue(['mon', 'tue'] as any);

    setUseListCrudHookMock({
      state: {
        isLoading: false,
        data: {
          data: [
            {id: 'current-1', startDate: currentDate, CampusDisplay: {name: fakeName}, mon: true},
            {id: 'past-1', startDate: pastDate, endDate: pastDate, CampusDisplay: {name: `${fakeName} Past`}, mon: true},
          ],
        },
      },
    });

    render(<CampusDisplayScheduleList locationId="location-1" />);

    expect(screen.getAllByTestId(TableTestId).length).toBeGreaterThan(0);
    expect(screen.getByText(fakeName)).toBeInTheDocument();
    expect(screen.getByText(/Past/i)).toBeInTheDocument();
  });
});
