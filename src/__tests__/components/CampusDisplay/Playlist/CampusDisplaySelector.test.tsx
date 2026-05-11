import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import CampusDisplaySelector, {
  translateToOption,
} from '../../../../components/CampusDisplay/Playlist/CampusDisplaySelector';
import CampusDisplayService from '../../../../services/CampusDisplay/CampusDisplayService';
import ComponentTestHelper from '../../../helper/ComponentTestHelper';
import {SelectBoxKey, SelectBoxTestId} from '../../../../components/common/__mocks__/SelectBox';
import TestHelper from '../../../helper/TestHelper';

jest.mock('../../../../components/common/SelectBox');
jest.mock('../../../../services/CampusDisplay/CampusDisplayService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));

describe('CampusDisplaySelector', () => {
  ComponentTestHelper.prepare();

  const mockedService = CampusDisplayService as jest.Mocked<typeof CampusDisplayService>;

  test('translates a display into an option and loads selected values', async () => {
    const fakeId = TestHelper.faker.string.uuid();
    const fakeName = TestHelper.faker.company.name();
    mockedService.getAll.mockResolvedValue({data: [{id: fakeId, name: fakeName}]} as any);

    expect(translateToOption({id: fakeId, name: fakeName} as any)).toEqual({
      value: fakeId,
      data: {id: fakeId, name: fakeName},
      label: fakeName,
    });

    render(<CampusDisplaySelector values={[fakeId]} />);

    await waitFor(() => expect(screen.getByTestId(SelectBoxTestId)).toBeInTheDocument());
    const selectBoxCalls = ComponentTestHelper.get(SelectBoxKey);

    expect(selectBoxCalls[selectBoxCalls.length - 1]).toMatchObject({
      value: [expect.objectContaining({value: fakeId, label: fakeName})],
    });
  });
});
