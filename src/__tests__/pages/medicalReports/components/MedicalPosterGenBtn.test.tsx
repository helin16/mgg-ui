import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {pdf} from '@react-pdf/renderer';
import {useSelector} from 'react-redux';
import MedicalPosterGenBtn from '../../../../pages/medicalReports/components/MedicalPosterGenBtn';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@react-pdf/renderer', () => ({
  __esModule: true,
  pdf: jest.fn(() => ({
    toBlob: jest.fn(),
  })),
  Document: ({children}: any) => <div data-testid="document">{children}</div>,
  Page: ({children}: any) => <div data-testid="page">{children}</div>,
  Text: ({children}: any) => <span>{children}</span>,
  View: ({children}: any) => <div>{children}</div>,
  Image: () => <img alt="" />,
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

describe('MedicalPosterGenBtn', () => {
  const mockedUseSelector = useSelector as jest.Mock;
  const mockedPdf = pdf as jest.MockedFunction<typeof pdf>;
  const originalCreateObjectUrl = URL.createObjectURL;
  const originalRevokeObjectUrl = URL.revokeObjectURL;

  beforeEach(() => {
    mockedUseSelector.mockImplementation((selector: any) => selector({
      auth: {
        user: {
          SynCurrentFileSemester: {
            FileYear: 2026,
            FileSemester: 2,
          },
        },
      },
    }));
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectUrl;
    URL.revokeObjectURL = originalRevokeObjectUrl;
    jest.restoreAllMocks();
  });

  test('generates and downloads the poster pdf when clicked', async () => {
    const toBlob = jest.fn().mockResolvedValue(new Blob(['poster'], {type: 'application/pdf'}));
    mockedPdf.mockReturnValue({toBlob} as any);
    const createObjectUrl = jest.fn().mockReturnValue('blob:medical-poster');
    const revokeObjectUrl = jest.fn();
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    URL.createObjectURL = createObjectUrl;
    URL.revokeObjectURL = revokeObjectUrl;

    render(
      <MedicalPosterGenBtn
        students={[
          {
            StudentID: 10,
            StudentSurname: 'Lovelace',
            StudentGiven1: 'Ada',
            StudentForm: '10A',
            StudentYearLevelSort: 10,
            FileYear: 2026,
            FileSemester: 2,
            profileUrl: 'https://example.com/avatar.jpg',
          } as any,
        ]}
        conditionsMap={{
          10: [
            {
              MedicalConditionSeq: 1,
              ConditionTypeDescription: 'Asthma',
              ConditionSeverityDescription: 'High',
            } as any,
          ],
        }}
        renderBtn={(onClick, isLoading) => (
          <button onClick={onClick} disabled={isLoading}>
            {isLoading ? 'Generating' : 'gen poster'}
          </button>
        )}
      />
    );

    await userEvent.click(screen.getByRole('button', {name: 'gen poster'}));

    await waitFor(() => expect(toBlob).toHaveBeenCalled());
    expect(createObjectUrl).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:medical-poster');
  });

  test('exposes loading state while the pdf is being generated', async () => {
    let resolveBlob: ((value: Blob) => void) | undefined;
    const toBlob = jest.fn().mockImplementation(() => new Promise(resolve => {
      resolveBlob = resolve;
    }));
    mockedPdf.mockReturnValue({toBlob} as any);
    URL.createObjectURL = jest.fn().mockReturnValue('blob:medical-poster');
    URL.revokeObjectURL = jest.fn();
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    render(
      <MedicalPosterGenBtn
        students={[]}
        conditionsMap={{}}
        renderBtn={(onClick, isLoading) => (
          <button onClick={onClick} disabled={isLoading}>
            {isLoading ? 'Generating' : 'gen poster'}
          </button>
        )}
      />
    );

    await userEvent.click(screen.getByRole('button', {name: 'gen poster'}));

    expect(screen.getByRole('button', {name: 'Generating'})).toBeDisabled();

    resolveBlob?.(new Blob(['poster'], {type: 'application/pdf'}));

    await waitFor(() =>
      expect(screen.getByRole('button', {name: 'gen poster'})).toBeEnabled()
    );
  });
});
