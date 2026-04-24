import React from 'react';
import {Document, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import iCreditorBPayBatch from '../../types/BPay/iCreditorBPayBatch';
import iCreditorBPayBatchSection from '../../types/BPay/iCreditorBPayBatchSection';
import iCreditorBPayBatchSectionItem from '../../types/BPay/iCreditorBPayBatchSectionItem';
import {
  calculateBatchTotal,
  calculateSectionTotal,
  getBatchItemCount,
  getBatchSections,
  getSectionItems,
  getUserFullName,
} from './CreditorBPayPanelHelper';

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 28,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D9DEE5',
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 6,
  },
  subtle: {
    color: '#5B6472',
    marginBottom: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  section: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E6EAF0',
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  itemTableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DEE5',
    paddingBottom: 4,
    marginBottom: 4,
    fontSize: 9,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 3,
    fontSize: 9,
  },
  colBiller: {
    width: '20%',
    paddingRight: 8,
  },
  colReference: {
    width: '32%',
    paddingRight: 8,
  },
  colCreditor: {
    width: '30%',
    paddingRight: 8,
  },
  colAmount: {
    width: '18%',
    textAlign: 'right',
  },
});

const formatDateTime = (value?: Date | string | null) => {
  if (!value) {
    return '-';
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? `${value}` : parsed.toLocaleString();
};

const formatAmount = (value?: number | null) => `$${Number(value || 0).toFixed(2)}`;

const getSectionLabel = (section: iCreditorBPayBatchSection, index: number) => {
  if (section.Creditor?.name) {
    return `${section.Creditor.name} [${section.Creditor.id}]`;
  }
  return section.customerName || section.title || `Section ${index + 1}`;
};

const getItemCreditorName = (item: iCreditorBPayBatchSectionItem, section: iCreditorBPayBatchSection) => {
  return item.creditorName || section.Creditor?.name || section.customerName || section.title || '-';
};

const BPayBatchExportPdf = ({batch}: {batch: iCreditorBPayBatch}) => {
  const sections = getBatchSections(batch);
  const createdBy = getUserFullName(batch?.CreatedBy);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>BPay Batch Summary</Text>
          <Text style={styles.subtle}>Created: {formatDateTime(batch?.createdAt)}{createdBy ? ` by ${createdBy}` : ''}</Text>
          <Text style={styles.subtle}>Generated: {formatDateTime(batch?.generatedAt)}</Text>
          <Text style={styles.subtle}>Sections: {sections.length}</Text>
          <Text style={styles.subtle}>Items: {getBatchItemCount(batch)}</Text>
          <View style={styles.summaryRow}>
            <Text>Total</Text>
            <Text>{formatAmount(calculateBatchTotal(batch))}</Text>
          </View>
        </View>

        {sections.map((section, index) => (
          <View key={`${section.id || section.Id || index}`} style={styles.section}>
            <Text style={styles.sectionTitle}>{getSectionLabel(section, index)}</Text>
            <View style={styles.summaryRow}>
              <Text>{getSectionItems(section).length} item(s)</Text>
              <Text>{formatAmount(calculateSectionTotal(section))}</Text>
            </View>
            <View style={styles.itemTableHeader}>
              <Text style={styles.colBiller}>Biller</Text>
              <Text style={styles.colReference}>Reference</Text>
              <Text style={styles.colCreditor}>Creditor</Text>
              <Text style={styles.colAmount}>Amount</Text>
            </View>
            {getSectionItems(section).map((item, itemIndex) => (
              <View key={`${item.id || item.Id || itemIndex}`} style={styles.itemRow}>
                <Text style={styles.colBiller}>{item.billerCode || '-'}</Text>
                <Text style={styles.colReference}>{item.reference || item.reference1 || '-'}</Text>
                <Text style={styles.colCreditor}>{getItemCreditorName(item, section)}</Text>
                <Text style={styles.colAmount}>{formatAmount(Number(item.amount || item.amt || 0))}</Text>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default BPayBatchExportPdf;
