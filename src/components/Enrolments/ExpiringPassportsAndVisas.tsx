import styled from "styled-components";
import { useEffect, useState } from "react";
import SynVStudentService from "../../services/Synergetic/Student/SynVStudentService";
import Toaster from "../../services/Toaster";
import PageLoadingSpinner from '../common/PageLoadingSpinner';
import iVStudent from '../../types/Synergetic/iVStudent';
import moment from 'moment-timezone';
import Table, {iTableColumn} from '../common/Table';
import ExplanationPanel from '../ExplanationPanel';

const Wrapper = styled.div``;

const ExpiringPassportsAndVisas = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<iVStudent[]>([]);
  const nextMonthEnd = moment().add(1, 'month').endOf('month');

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);

    SynVStudentService.getVStudentAll({
      where: JSON.stringify({
        CurrentSemesterOnlyFlag: true,
        StudentActiveFlag: true,
      }),
      perPage: 999999
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setStudents((resp.data || []).filter(student => {
          if (`${student.StudentPassportExpiryDate}`.trim() !== '' && moment(`${student.StudentPassportExpiryDate}`.trim()).isSameOrBefore(nextMonthEnd)) {
            return true;
          }

          if (`${student.StudentsVisaExpiryDate}`.trim() !== '' && moment(`${student.StudentsVisaExpiryDate}`.trim()).isSameOrBefore(nextMonthEnd)) {
            return true;
          }

          return false;
        }))
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getColumns = () => [{
    key: 'StudentID',
    header: 'ID',
    cell: (col: iTableColumn, data: iVStudent) => {
      return <td key={col.key}>{data.StudentID}</td>
    }
  }, {
    key: 'StudentName',
    header: 'Name',
    cell: (col: iTableColumn, data: iVStudent) => {
      return <td key={col.key}>{data.StudentNameInternal}</td>
    }
  }, {
    key: 'Form',
    header: 'Form',
    cell: (col: iTableColumn, data: iVStudent) => {
      return <td key={col.key}>{data.StudentForm}</td>
    }
  }, {
    key: 'PassportNo',
    header: 'Passport No.',
    cell: (col: iTableColumn, data: iVStudent) => {
      return <td key={col.key}>{data.StudentsPassportNo}</td>
    }
  }, {
    key: 'PassportExpiryDate',
    header: 'Passport Expiry Date',
    cell: (col: iTableColumn, data: iVStudent) => {
      if (`${data.StudentPassportExpiryDate || ''}`.trim() === '') {
        return <td key={col.key}></td>;
      }
      const expired = moment(data.StudentPassportExpiryDate).isBefore(moment());
      return <td key={col.key} className={expired ? 'text-white bg-danger' : ''}>{moment(data.StudentPassportExpiryDate).format('DD MMM YYYY')}</td>
    }
  }, {
    key: 'VisaNo',
    header: 'Visa No.',
    cell: (col: iTableColumn, data: iVStudent) => {
      return <td key={col.key}>{data.StudentVisaNumber}</td>
    }
  }, {
    key: 'VisaExpiryDate',
    header: 'Visa Expiry Date',
    cell: (col: iTableColumn, data: iVStudent) => {
      if (`${data.StudentsVisaExpiryDate || ''}`.trim() === '') {
        return <td key={col.key}></td>;
      }
      const expired = moment(data.StudentsVisaExpiryDate).isBefore(moment());
      return <td key={col.key} className={expired ? 'text-white bg-danger' : ''}>{moment(data.StudentsVisaExpiryDate).format('DD MMM YYYY')}</td>
    }
  }]

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />
    }
    return (
      <>
        <ExplanationPanel text={
          <>
            This is list of students with passport(s) or visa(s) that has expired or will expire by <b>{nextMonthEnd.format('DD MMM YYYY')}</b>
          </>
        } />
        <Table columns={getColumns()} rows={students} responsive striped hover />
      </>
    )
  }

  return <Wrapper>{getContent()}</Wrapper>;
};

export default ExpiringPassportsAndVisas;
