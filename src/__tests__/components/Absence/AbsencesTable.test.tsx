import React from 'react';
import {render, screen} from '@testing-library/react';
import AbsencesTable from '../../../components/Absence/AbsencesTable';

jest.mock('../../../components/common/Table');

describe('AbsencesTable', () => {
  test('sorts absences by date and period and renders the formatted columns', () => {
    render(
      <AbsencesTable
        absences={[
          {
            ID: 2,
            AbsenceDate: '2026-01-02T00:00:00.000Z',
            AbsencePeriod: 'P2',
            AbsencePeriodSort: 2,
            SynLuAbsenceType: {Code: 'ILL', Description: 'Illness'},
            SynLuAbsenceReason: {Code: 'MED', Description: 'Medical'},
            Description: 'Doctor note',
          },
          {
            ID: 1,
            AbsenceDate: '2026-01-01T00:00:00.000Z',
            AbsencePeriod: 'P1',
            AbsencePeriodSort: 1,
            SynLuAbsenceType: {Code: 'LATE', Description: 'Late'},
            SynLuAbsenceReason: {Code: 'TRAF', Description: 'Traffic'},
            Description: 'Bus delay',
          },
        ] as any}
      />
    );

    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('2026-01-01');
    expect(cells[1]).toHaveTextContent('P1');
    expect(cells[2]).toHaveTextContent('LATE - Late');
    expect(cells[3]).toHaveTextContent('TRAF - Traffic');
    expect(cells[4]).toHaveTextContent('Bus delay');
  });
});
