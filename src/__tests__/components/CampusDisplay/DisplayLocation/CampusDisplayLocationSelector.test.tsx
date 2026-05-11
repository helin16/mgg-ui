import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import CampusDisplayLocationSelector, {
  translateToOption,
} from '../../../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationSelector';
import CampusDisplayLocationService from '../../../../services/CampusDisplay/CampusDisplayLocationService';
import ComponentTestHelper from '../../../helper/ComponentTestHelper';
import {SelectBoxKey, SelectBoxTestId} from '../../../../components/common/__mocks__/SelectBox';
import TestHelper from '../../../helper/TestHelper';

jest.mock('../../../../components/common/SelectBox');
jest.mock('../../../../services/CampusDisplay/CampusDisplayLocationService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');

describe('CampusDisplayLocationSelector', () => {
  ComponentTestHelper.prepare();

  const mockedService = CampusDisplayLocationService as jest.Mocked<typeof CampusDisplayLocationService>;

  test('translates a location into a select option', () => {
    const fakeId = TestHelper.faker.string.uuid();
    const fakeName = TestHelper.faker.location.city();

    expect(translateToOption({id: fakeId, name: fakeName} as any)).toEqual({
      value: fakeId,
      data: {id: fakeId, name: fakeName},
      label: fakeName,
    });
  });

  test('loads location options and maps string values into selected options', async () => {
    const fakeId = TestHelper.faker.string.uuid();
    const fakeName = TestHelper.faker.location.city();
    mockedService.getAll.mockResolvedValue({
      data: [{id: fakeId, name: fakeName}],
    } as any);

    render(<CampusDisplayLocationSelector values={[fakeId]} />);

    await waitFor(() => expect(screen.getByTestId(SelectBoxTestId)).toBeInTheDocument());
    const selectBoxCalls = ComponentTestHelper.get(SelectBoxKey);

    expect(selectBoxCalls[selectBoxCalls.length - 1]).toMatchObject({
      value: [expect.objectContaining({value: fakeId, label: fakeName})],
    });
  });
});
