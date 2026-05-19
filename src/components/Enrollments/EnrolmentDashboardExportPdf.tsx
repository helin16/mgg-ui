import React from 'react';
import {Document, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import moment from 'moment-timezone';

export type iEnrolmentDashboardExportColumn = {
  key: string;
  label: string;
  isTotal?: boolean;
};

export type iEnrolmentDashboardExportRow = {
  label: string;
  values: {[key: string]: number};
  isSummary?: boolean;
};

type iEnrolmentDashboardExportPdf = {
  columns: iEnrolmentDashboardExportColumn[];
  rows: iEnrolmentDashboardExportRow[];
  selectedCampusLabels: string[];
  selectedFullFeeStudentType: string;
  currentYear: number;
  nextYear: number;
  currentFutureStatusCount: number;
  futureStatusCount: number;
  showTransitColumns: boolean;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    fontSize: 6,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  subtle: {
    fontSize: 8,
    color: '#5B6472',
    marginBottom: 2,
  },
  table: {
    borderWidth: 1,
    borderColor: '#D9DEE5',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EAF0',
  },
  headerCell: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D9DEE5',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DEE5',
    fontSize: 6,
  },
  summaryRow: {
    backgroundColor: '#E9ECEF',
    fontFamily: 'Helvetica-Bold',
  },
  headerRow: {
    backgroundColor: '#F5F7FA',
    fontFamily: 'Helvetica-Bold',
  },
  totalCell: {
    backgroundColor: '#F2F4F7',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  summaryCell: {
    borderRightColor: '#F8FAFC',
  },
  rowLabel: {
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderRightWidth: 1,
    borderRightColor: '#E6EAF0',
    fontSize: 6,
    textAlign: 'right',
  },
  cell: {
    paddingVertical: 4,
    paddingHorizontal: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E6EAF0',
    fontSize: 8,
  },
});

const disableHyphenation = (word: string | null) => [word || ''];

const EnrolmentDashboardExportPdf = ({
  columns,
  rows,
  selectedCampusLabels,
  selectedFullFeeStudentType,
  currentYear,
  nextYear,
  currentFutureStatusCount,
  futureStatusCount,
  showTransitColumns,
}: iEnrolmentDashboardExportPdf) => {
  const rowLabelWidth = '10%';
  const dataColumnWidth = `${90 / Math.max(columns.length, 1)}%`;
  const getSpanWidth = (span: number) => `${(90 * span) / Math.max(columns.length, 1)}%`;
  const currentYearColumnCount = 10 + (showTransitColumns ? 2 : 0) + currentFutureStatusCount;
  const futureYearColumnCount = 3 + futureStatusCount;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.title} hyphenationCallback={disableHyphenation}>Enrolment Numbers</Text>
          <Text style={styles.subtle} hyphenationCallback={disableHyphenation}>Generated: {moment().format('DD MMM YYYY h:mm A')}</Text>
          <Text style={styles.subtle} hyphenationCallback={disableHyphenation}>Campuses: {selectedCampusLabels.join(', ') || '-'}</Text>
          <Text style={styles.subtle} hyphenationCallback={disableHyphenation}>Student Type: {selectedFullFeeStudentType}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]} fixed>
            <Text style={[styles.headerCell, {width: rowLabelWidth, borderBottomWidth: 0}]} hyphenationCallback={disableHyphenation}></Text>
            <Text style={[styles.headerCell, {width: getSpanWidth(currentYearColumnCount)}]} hyphenationCallback={disableHyphenation}>{currentYear}</Text>
            <Text style={[styles.headerCell, {width: getSpanWidth(futureYearColumnCount), borderRightWidth: 0}]} hyphenationCallback={disableHyphenation}>{nextYear}</Text>
          </View>

          <View style={[styles.row, styles.headerRow]} fixed>
            <Text style={[styles.headerCell, {width: rowLabelWidth, borderBottomWidth: 0}]} hyphenationCallback={disableHyphenation}></Text>
            <Text style={[styles.headerCell, {width: getSpanWidth(3)}]} hyphenationCallback={disableHyphenation}>Past</Text>
            <Text style={[styles.headerCell, {width: getSpanWidth(1)}]} hyphenationCallback={disableHyphenation}></Text>
            <Text style={[styles.headerCell, {width: getSpanWidth(2 + (showTransitColumns ? 2 : 0))}]} hyphenationCallback={disableHyphenation}>{`Existing ${currentYear}`}</Text>
            <Text style={[styles.headerCell, {width: getSpanWidth(1)}]} hyphenationCallback={disableHyphenation}></Text>
            <Text style={[styles.headerCell, {width: getSpanWidth(1)}]} hyphenationCallback={disableHyphenation}></Text>
            <Text style={[styles.headerCell, {width: getSpanWidth(1)}]} hyphenationCallback={disableHyphenation}></Text>
            {currentFutureStatusCount > 0 && (
              <Text style={[styles.headerCell, {width: getSpanWidth(currentFutureStatusCount)}]} hyphenationCallback={disableHyphenation}>{`Future ${currentYear}`}</Text>
            )}
            <Text style={[styles.headerCell, {width: getSpanWidth(1)}]} hyphenationCallback={disableHyphenation}></Text>
            <Text style={[styles.headerCell, {width: getSpanWidth(futureYearColumnCount), borderRightWidth: 0}]} hyphenationCallback={disableHyphenation}>{`Future ${nextYear}`}</Text>
          </View>

          <View style={[styles.row, styles.headerRow]} fixed>
            <Text style={[styles.headerCell, {width: rowLabelWidth}]} hyphenationCallback={disableHyphenation}></Text>
            {columns.map((column, index) => (
              <Text
                key={column.key}
                hyphenationCallback={disableHyphenation}
                style={[
                  styles.headerCell,
                  column.isTotal ? styles.totalCell : {},
                  {
                    width: dataColumnWidth,
                    borderRightWidth: index === columns.length - 1 ? 0 : 1,
                  }
                ]}
              >
                {column.label}
              </Text>
            ))}
          </View>

          {rows.map((row) => (
            <View key={row.label} style={row.isSummary ? [styles.row, styles.summaryRow] : styles.row} wrap={false}>
              <Text
                hyphenationCallback={disableHyphenation}
                style={[
                  styles.rowLabel,
                  row.isSummary ? styles.summaryCell : {},
                  {width: rowLabelWidth}
                ]}
              >
                {row.label}
              </Text>
              {columns.map((column, index) => (
                <Text
                  key={`${row.label}-${column.key}`}
                  hyphenationCallback={disableHyphenation}
                  style={[
                    styles.cell,
                    row.isSummary ? styles.summaryCell : {},
                    column.isTotal ? styles.totalCell : {},
                    {
                      width: dataColumnWidth,
                      borderRightWidth: index === columns.length - 1 ? 0 : 1,
                    }
                  ]}
                >
                  {row.values[column.key] || ''}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default EnrolmentDashboardExportPdf;
