import {useEffect, useMemo, useState} from 'react';
import moment from 'moment-timezone';
import Table, {iTableColumn} from '../../common/Table';
import StaffSkillExpirationService from '../../../services/StaffSkillExpiration/StaffSkillExpirationService';
import Toaster from '../../../services/Toaster';
import iStaffSkillExpirationLog, {iStaffSkillExpirationLogsResult} from '../../../types/StaffSkillExpiration/iStaffSkillExpirationLog';

const DEFAULT_PAGE_SIZE = 20;

const getSkillsLabel = (log: iStaffSkillExpirationLog) => {
  if (log.notificationType === 'individual') {
    return (log.skillCodes || []).join(', ');
  }
  return (log.staffIds || []).length > 0 ? `${log.staffIds.length} staff` : '';
};

const SkillExpirationLogsPanel = () => {
  const [result, setResult] = useState<iStaffSkillExpirationLogsResult>({
    data: [],
    total: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    StaffSkillExpirationService.getLogs({
      page: currentPage,
      pageSize,
    })
      .then(resp => {
        if (isCancelled) {
          return;
        }
        setResult({
          data: resp.data || [],
          total: resp.total || 0,
          page: resp.page || currentPage,
          pageSize: resp.pageSize || pageSize,
        });
      })
      .catch(err => {
        if (isCancelled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [currentPage, pageSize]);

  const columns = useMemo<iTableColumn<iStaffSkillExpirationLog>[]>(
    () => [
      {
        key: 'createdAt',
        header: 'Created',
        cell: (col, log) => <td key={col.key}>{moment(log.createdAt).format('lll')}</td>,
      },
      {
        key: 'notificationType',
        header: 'Type',
        cell: (col, log) => <td key={col.key}>{log.notificationType}</td>,
      },
      {
        key: 'status',
        header: 'Status',
        cell: (col, log) => <td key={col.key}>{log.status}</td>,
      },
      {
        key: 'recipient',
        header: 'Recipient',
        cell: (col, log) => <td key={col.key}>{log.recipient}</td>,
      },
      {
        key: 'staffName',
        header: 'Staff',
        cell: (col, log) => <td key={col.key}>{log.staffName}</td>,
      },
      {
        key: 'skills',
        header: 'Skills',
        cell: (col, log) => <td key={col.key}>{getSkillsLabel(log)}</td>,
      },
      {
        key: 'subject',
        header: 'Subject',
        cell: (col, log) => <td key={col.key}>{log.subject}</td>,
      },
    ],
    []
  );

  const totalPages = Math.max(1, Math.ceil((result.total || 0) / (pageSize || 1)));

  return (
    <Table
      striped
      hover
      responsive
      isLoading={isLoading}
      columns={columns}
      rows={result.data}
      pagination={{
        currentPage,
        totalPages,
        onSetCurrentPage: setCurrentPage,
        perPage: pageSize,
        onPageSizeChanged: nextPageSize => {
          setCurrentPage(1);
          setPageSize(nextPageSize);
        },
        pageSizeProps: {
          start: 20,
          end: 100,
          steps: 20,
        },
      }}
    />
  );
};

export default SkillExpirationLogsPanel;
