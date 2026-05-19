import React from 'react';
import {render, screen, within} from '@testing-library/react';

jest.mock('@react-pdf/renderer', () => {
  const React = require('react');

  const flattenStyle = (style: any) => {
    if (Array.isArray(style)) {
      return style.reduce((acc, item) => ({
        ...acc,
        ...(item || {}),
      }), {});
    }
    return style || {};
  };

  const toDataStyle = (style: any) => JSON.stringify(flattenStyle(style));

  return {
    __esModule: true,
    Document: ({children}: any) => <div data-testid="document">{children}</div>,
    Page: ({children, ...props}: any) => (
      <div data-testid="page" data-props={JSON.stringify(props)}>
        {children}
      </div>
    ),
    Text: ({children, style, ...props}: any) => (
      <span data-style={toDataStyle(style)} data-props={JSON.stringify(props)}>
        {children}
      </span>
    ),
    View: ({children, style, ...props}: any) => (
      <div data-style={toDataStyle(style)} data-props={JSON.stringify(props)}>
        {children}
      </div>
    ),
    StyleSheet: {
      create: (styles: any) => styles,
    },
  };
});

jest.mock('moment-timezone', () => {
  const actualMoment = jest.requireActual('moment-timezone');
  const fixedMoment = (...args: any[]) => actualMoment(...(args.length > 0 ? args : ['2026-05-20T09:02:00+10:00']));
  Object.assign(fixedMoment, actualMoment);
  return fixedMoment;
});

import EnrolmentDashboardExportPdf from '../../../components/Enrollments/EnrolmentDashboardExportPdf';

const defaultProps = {
  columns: [
    {key: 'current-continued-prev', label: 'Continued from 2025'},
    {key: 'current-day-1', label: 'Day 1 2026 Total', isTotal: true},
    {key: 'current-total-today', label: 'Total Today', isTotal: true},
    {key: 'current-total-year-end', label: 'Total at Year End', isTotal: true},
    {key: 'future-total-start', label: 'Total Start', isTotal: true},
  ],
  rows: [
    {
      label: 'Kindergarten',
      values: {
        'current-continued-prev': 0,
        'current-day-1': 11,
        'current-total-today': 12,
        'current-total-year-end': 13,
        'future-total-start': 22,
      },
    },
    {
      label: 'Early Learning Centre',
      isSummary: true,
      values: {
        'current-continued-prev': 19,
        'current-day-1': 33,
        'current-total-today': 34,
        'current-total-year-end': 35,
        'future-total-start': 35,
      },
    },
  ],
  selectedCampusLabels: ['Early Learning Centre', 'Junior', 'Senior'],
  selectedFullFeeStudentType: 'All',
  currentYear: 2026,
  nextYear: 2027,
  currentFutureStatusCount: 2,
  futureStatusCount: 3,
  showTransitColumns: true,
};

const getStyle = (node: HTMLElement | null) => JSON.parse(node?.getAttribute('data-style') || '{}');

describe('EnrolmentDashboardExportPdf', () => {
  test('renders document metadata and grouped headers', () => {
    render(<EnrolmentDashboardExportPdf {...defaultProps} />);

    expect(JSON.parse(screen.getByTestId('page').getAttribute('data-props') || '{}')).toMatchObject({
      size: 'A4',
      orientation: 'landscape',
    });
    expect(screen.getByText('Enrolment Numbers')).toBeInTheDocument();
    expect(screen.getByText('Generated: 20 May 2026 9:02 AM')).toBeInTheDocument();
    expect(screen.getByText('Campuses: Early Learning Centre, Junior, Senior')).toBeInTheDocument();
    expect(screen.getByText('Student Type: All')).toBeInTheDocument();

    expect(screen.getByText('2026')).toBeInTheDocument();
    expect(screen.getByText('2027')).toBeInTheDocument();
    expect(screen.getByText('Past')).toBeInTheDocument();
    expect(screen.getByText('Existing 2026')).toBeInTheDocument();
    expect(screen.getByText('Future 2026')).toBeInTheDocument();
    expect(screen.getByText('Future 2027')).toBeInTheDocument();

    expect(getStyle(screen.getByText('Kindergarten'))).toMatchObject({
      width: '10%',
      textAlign: 'right',
    });
  });

  test('applies total column and summary row styling to exported cells', () => {
    render(<EnrolmentDashboardExportPdf {...defaultProps} />);

    const totalHeaderCell = screen.getByText('Day 1 2026 Total');
    expect(getStyle(totalHeaderCell)).toMatchObject({
      backgroundColor: '#F2F4F7',
      borderBottomColor: '#FFFFFF',
    });

    const summaryLabelCell = screen.getByText('Early Learning Centre');
    expect(getStyle(summaryLabelCell)).toMatchObject({
      textAlign: 'right',
      borderRightColor: '#F8FAFC',
    });

    const summaryRow = summaryLabelCell.closest('div');
    expect(summaryRow).not.toBeNull();
    expect(getStyle(summaryRow as HTMLElement)).toMatchObject({
      backgroundColor: '#E9ECEF',
      fontFamily: 'Helvetica-Bold',
    });

    const summaryTotalValue = within(summaryRow as HTMLElement).getByText('33');
    expect(getStyle(summaryTotalValue)).toMatchObject({
      backgroundColor: '#F2F4F7',
      borderBottomColor: '#FFFFFF',
      borderRightColor: '#F8FAFC',
    });
  });

  test('omits the current-year future group label when there are no current future status columns', () => {
    render(
      <EnrolmentDashboardExportPdf
        {...defaultProps}
        currentFutureStatusCount={0}
      />
    );

    expect(screen.queryByText('Future 2026')).toBeNull();
    expect(screen.getByText('Future 2027')).toBeInTheDocument();
  });
});
