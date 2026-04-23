import iAcaraData from "./iAcaraData";
import Table, { iTableColumn } from "../../../../components/common/Table";
import PageLoadingSpinner from "../../../../components/common/PageLoadingSpinner";
import moment from "moment-timezone";
import styled from "styled-components";
import AcaraDataHelper from "./AcaraDataHelper";
import { Badge } from "react-bootstrap";
import { FlexContainer } from "../../../../styles";

type iAcaraDataList = {
  records: iAcaraData[];
  isLoading?: boolean;
};

const Wrapper = styled.div`
  .parent-table {
    font-size: 12px;
    .title-col {
      font-weight: bold;
    }
    .parent-col {
      width: 350px;
    }
  }
`;
const AcaraDataList = ({ records, isLoading = false }: iAcaraDataList) => {
  if (records.length <= 0) {
    return null;
  }

  const getParentTd = (row: iAcaraData, parentIndex: number) => {
    const parentInfo = AcaraDataHelper.parseParentInfo(row, parentIndex);
    if (parentInfo === null) {
      return null;
    }
    const {
      parentId,
      parentName,

      parentMainSLG,

      parentHomeLanguageCode,
      parentHomeLanguageDescription,
      parentHomeLanguageLangValidFlag,

      parentHighestSchoolEducation,
      parentHighestSchoolEducationCode,
      parentHighestSchoolEducationValidFlag,

      parentHighestNonSchoolEducation,
      parentHighestNonSchoolEducationValidFlag,
      parentHighestNonSchoolEducationCode,
      parentHighestNonSchoolEducationDescription,

      parentOccupationGroup,
      parentOccupationGroupValidFlag,
      parentOccupationGroupCode,
      parentOccupationGroupDescription,
    } = parentInfo;

    return (
      <table className={"parent-table"}>
        <tbody>
          <tr>
            <td className={"title-col"}>Name:</td>
            <td>
              {parentName} [{parentId}]
            </td>
          </tr>
          <tr>
            <td className={"title-col"}>Lang.:</td>
            <td>
              <FlexContainer className={"justify-content space-between"}>
                <div>
                  {parentHomeLanguageCode} - {parentHomeLanguageDescription} [<b>Acara</b>: {parentMainSLG}]
                </div>
                <div>{parentHomeLanguageLangValidFlag === true ? null : <Badge bg={'danger'}>Invalid</Badge> }</div>
              </FlexContainer>
            </td>
          </tr>
          <tr>
            <td className={"title-col"}>School Edu.:</td>
            <td>
              <FlexContainer className={"justify-content space-between"}>
                <div>
                  {parentHighestSchoolEducationCode} [<b>Acara</b>: {parentHighestSchoolEducation}]
                </div>
                <div>{parentHighestSchoolEducationValidFlag === true ? null : <Badge bg={'danger'}>Invalid</Badge> }</div>
              </FlexContainer>
            </td>
          </tr>
          <tr>
            <td className={"title-col"}>Non School:</td>
            <td>
              <FlexContainer className={"justify-content space-between"}>
                <div>
                  {parentHighestNonSchoolEducationCode} - {parentHighestNonSchoolEducationDescription}
                  [<b>Acara</b>: {parentHighestNonSchoolEducation}]
                </div>
                <div>{parentHighestNonSchoolEducationValidFlag === true ? null : <Badge bg={'danger'}>Invalid</Badge> }</div>
              </FlexContainer>
            </td>
          </tr>
          <tr>
            <td className={"title-col"}>Occp Grp.:</td>
            <td>
              <FlexContainer className={"justify-content space-between"}>
                <div>
                  {parentOccupationGroupCode} - {parentOccupationGroupDescription}
                  [<b>Acara</b>: {parentOccupationGroup}]
                </div>
                <div>{parentOccupationGroupValidFlag === true ? null : <Badge bg={'danger'}>Invalid</Badge> }</div>
              </FlexContainer>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const getColumns = <T extends {}>() => {
    return [
      {
        key: "Student",
        header: "Student",
        cell: (column: iTableColumn<T>, row: iAcaraData) => {
          return (
            <td key={column.key}>
              <div>[{row.ID}]</div>
              <div>
                {row.Surname}, {row.Given1}
              </div>
            </td>
          );
        }
      },
      {
        key: "Semester",
        header: "Semester",
        cell: (column: iTableColumn<T>, row: iAcaraData) => {
          return (
            <td key={column.key}>
              {row.fileYear} - {row.fileSemester}
            </td>
          );
        }
      },
      {
        key: "yearLevel",
        header: "Yr Lvl.",
        cell: (column: iTableColumn<T>, row: iAcaraData) => {
          return <td key={column.key}>{row.yearLevelCode}</td>;
        }
      },
      {
        key: "dateOfBirth",
        header: "D.O.B.",
        cell: (column: iTableColumn<T>, row: iAcaraData) => {
          return (
            <td key={column.key}>
              {moment(row.dateOfBirth).format("DD MMM YYYY")}
            </td>
          );
        }
      },{
        key: "entryDate",
        header: "Entry Date",
        cell: (column: iTableColumn<T>, row: iAcaraData) => {
          return (
            <td key={column.key}>
              {moment(row.entryDate).format("DD MMM YYYY")}
            </td>
          );
        }
      },
      {
        key: "homeLanguage",
        header: "Home Language",
        cell: (column: iTableColumn<T>, row: iAcaraData) => {
          return (
            <td key={column.key}>
              <div>
                {row.studentHomeLanguageCode} -{" "}
                {row.studentHomeLanguageDescription}
              </div>
              <div>
                <b>Acara Code</b>: {row.studentMainSLG}{" "}
                {row.studentMainSLGValidFlag === true ? null : (
                  <Badge bg={"danger"}>Not Valid</Badge>
                )}
              </div>
            </td>
          );
        }
      },
      {
        key: "isInternational",
        header: "internal?",
        cell: (column: iTableColumn<T>, row: iAcaraData) => {
          return (
            <td key={column.key}>
              {row.isInternationalStudent === true ? "Y" : ""}
            </td>
          );
        }
      },
      {
        key: "isPastStudent",
        header: "past?",
        cell: (column: iTableColumn<T>, row: iAcaraData) => {
          return (
            <td key={column.key}>
              <div>{row.isPastStudent === true ? "Y" : ""}</div>
              <div>
                {`${row.leavingDate || ""}`.trim() === "" ? null : (
                  <>
                    <b>Left</b>: {moment(row.leavingDate).format("DD MMM YYYY")}
                  </>
                )}
              </div>
            </td>
          );
        }
      },
      {
        key: "ATSI",
        header: "ATSI",
        cell: (column: iTableColumn<T>, row: iAcaraData) => {
          return (
            <td key={column.key}>
              <div>Ind.?: {row.isAboriginal === true ? "Y" : ""}</div>
              <div>TSIsldr.?: {row.isAboriginal === true ? "Y" : ""}</div>
              <div>
                <b>Acara</b>: {row.ATSIStatus}
              </div>
            </td>
          );
        }
      },
      {
        key: "Parent1",
        header: "Parent 1",
        cell: (column: iTableColumn<T>, row: iAcaraData) => {
          return (
            <td key={column.key} className={"parent-col"}>
              {getParentTd(row, 1)}
            </td>
          );
        }
      },
      {
        key: "Parent2",
        header: "Parent 2",
        cell: (column: iTableColumn<T>, row: iAcaraData) => {
          return (
            <td key={column.key} className={"parent-col"}>
              {getParentTd(row, 2)}
            </td>
          );
        }
      }
    ];
  };

  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper>
      <Table hover striped responsive columns={getColumns<iAcaraData>()} rows={records} />
    </Wrapper>
  );
};

export default AcaraDataList;
