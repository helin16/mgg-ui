import React from 'react';
import {render, screen} from '@testing-library/react';
import ExpiringPassportsAndVisas from '../../../components/Enrollments/ExpiringPassportsAndVisas';
import {
  setUseListCrudHookMock,
  useListCrudHookTestId,
} from '../../../components/hooks/useListCrudHook/useListCrudHook';

jest.mock('../../../components/hooks/useListCrudHook/useListCrudHook');
jest.mock('../../../components/common/PageLoadingSpinner');
jest.mock('../../../components/ExplanationPanel');

describe('ExpiringPassportsAndVisas', () => {
  test('shows loading state from the list hook', () => {
    setUseListCrudHookMock({state: {isLoading: true}});

    render(<ExpiringPassportsAndVisas />);

    expect(screen.getByTestId('PageLoadingSpinnerTestId')).toBeInTheDocument();
  });

  test('renders filtered expiring records', () => {
    setUseListCrudHookMock({
      state: {
        isLoading: false,
        data: {
          data: [
            {
              StudentID: 1,
              StudentNameInternal: 'Student One',
              StudentForm: '7A',
              StudentsPassportNo: 'P123',
              StudentPassportExpiryDate: new Date().toISOString(),
              StudentVisaNumber: 'V123',
              StudentsVisaExpiryDate: '',
            },
          ],
        },
      },
    });

    render(<ExpiringPassportsAndVisas />);

    expect(screen.getByTestId(useListCrudHookTestId)).toBeInTheDocument();
    expect(screen.getByText('Student One')).toBeInTheDocument();
  });
});
