import styled from "styled-components";
import SynVStudentService from "../../services/Synergetic/Student/SynVStudentService";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import iVStudent from "../../types/Synergetic/Student/iVStudent";
import moment from "moment-timezone";
import { iTableColumn } from "../common/Table";
import ExplanationPanel from "../ExplanationPanel";
import useListCrudHook from "../hooks/useListCrudHook/useListCrudHook";
import {useCallback} from 'react';

const Wrapper = styled.div``;

const ExpiringPassportsAndVisas = () => {
  const nextMonthEnd = moment()
    .add(1, "month")
    .endOf("month");
  const { state, renderDataTable } = useListCrudHook<iVStudent>({
    perPage: 999999,
    getFn: useCallback(config => {
      const { filter, ...props } = config || {};
      return SynVStudentService.getVStudentAll({
        where: JSON.stringify({
          CurrentSemesterOnlyFlag: true,
          StudentActiveFlag: true,
          ...filter
        }),
        ...props
      });
    }, []),
  });

  const getColumns = <T extends {}>() => [
    {
      key: "StudentID",
      header: "ID",
      cell: (col: iTableColumn<T>, data: iVStudent) => {
        return <td key={col.key}>{data.StudentID}</td>;
      }
    },
    {
      key: "StudentName",
      header: "Name",
      cell: (col: iTableColumn<T>, data: iVStudent) => {
        return <td key={col.key}>{data.StudentNameInternal}</td>;
      }
    },
    {
      key: "Form",
      header: "Form",
      cell: (col: iTableColumn<T>, data: iVStudent) => {
        return <td key={col.key}>{data.StudentForm}</td>;
      }
    },
    {
      key: "PassportNo",
      header: "Passport No.",
      cell: (col: iTableColumn<T>, data: iVStudent) => {
        return <td key={col.key}>{data.StudentsPassportNo}</td>;
      }
    },
    {
      key: "PassportExpiryDate",
      header: "Passport Expiry Date",
      cell: (col: iTableColumn<T>, data: iVStudent) => {
        if (`${data.StudentPassportExpiryDate || ""}`.trim() === "") {
          return <td key={col.key}></td>;
        }
        const expired = moment(data.StudentPassportExpiryDate).isBefore(
          moment()
        );
        return (
          <td key={col.key} className={expired ? "text-white bg-danger" : ""}>
            {moment(data.StudentPassportExpiryDate).format("DD MMM YYYY")}
          </td>
        );
      }
    },
    {
      key: "VisaNo",
      header: "Visa No.",
      cell: (col: iTableColumn<T>, data: iVStudent) => {
        return <td key={col.key}>{data.StudentVisaNumber}</td>;
      }
    },
    {
      key: "VisaExpiryDate",
      header: "Visa Expiry Date",
      cell: (col: iTableColumn<T>, data: iVStudent) => {
        if (`${data.StudentsVisaExpiryDate || ""}`.trim() === "") {
          return <td key={col.key}></td>;
        }
        const expired = moment(data.StudentsVisaExpiryDate).isBefore(moment());
        return (
          <td key={col.key} className={expired ? "text-white bg-danger" : ""}>
            {moment(data.StudentsVisaExpiryDate).format("DD MMM YYYY")}
          </td>
        );
      }
    }
  ];

  const getData = () => {
    return (state.data.data || []).filter(student => {
      if (
        `${student.StudentPassportExpiryDate}`.trim() !== "" &&
        moment(`${student.StudentPassportExpiryDate}`.trim()).isSameOrBefore(
          nextMonthEnd
        )
      ) {
        return true;
      }

      if (
        `${student.StudentsVisaExpiryDate}`.trim() !== "" &&
        moment(`${student.StudentsVisaExpiryDate}`.trim()).isSameOrBefore(
          nextMonthEnd
        )
      ) {
        return true;
      }

      return false;
    });
  };

  const getContent = () => {
    if (state.isLoading === true) {
      return <PageLoadingSpinner />;
    }
    return (
      <>
        <ExplanationPanel
          text={
            <>
              This is list of students with passport(s) or visa(s) that has
              expired or will expire by{" "}
              <b>{nextMonthEnd.format("DD MMM YYYY")}</b>
            </>
          }
        />
        {renderDataTable({
          columns: getColumns<iVStudent>(),
          rows: getData(),
          responsive: true,
          striped: true,
          hover: true
        })}
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default ExpiringPassportsAndVisas;
