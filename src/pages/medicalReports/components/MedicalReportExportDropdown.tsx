import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";
import iVStudent from "../../../types/Synergetic/Student/iVStudent";
import iSynVMedicalConditionStudent from "../../../types/Synergetic/iSynVMedicalConditionStudent";
import * as Icons from "react-bootstrap-icons";
import * as XLSX from "sheetjs-style";
import moment from "moment-timezone";
import MedicalPosterGenBtn from "./MedicalPosterGenBtn";

const Wrapper = styled.div`
  .ap-dropdown {
    button {
      font-size: 11px;
      padding: 0.125rem 0.5rem;
    }
  }
`;

const ARG_HEX_GREEN = "FF339933";
const ARG_HEX_ORANGE = "FFFFAA00";
const ARG_HEX_RED = "FFFF0000";

type iMedicalReportExportDropdown = {
  students: iVStudent[];
  conditionsMap: { [key: number]: iSynVMedicalConditionStudent[] };
};
const MedicalReportExportDropdown = ({
  students,
  conditionsMap
}: iMedicalReportExportDropdown) => {
  if (students.length <= 0) {
    return null;
  }

  const getFillObj = (color: string) => {
    return {
      fill: {
        patternType: "solid", // none / solid
        fgColor: { rgb: color },
        bgColor: { rgb: color }
      }
    };
  };

  const getBgColorObj = (colName: string, color: string) => {
    if (
      !colName
        .trim()
        .toUpperCase()
        .startsWith("D")
    ) {
      return {};
    }
    switch (color.toLowerCase()) {
      case "green": {
        return getFillObj(ARG_HEX_GREEN);
      }
      case "red": {
        return getFillObj(ARG_HEX_RED);
      }
      case "orange": {
        return getFillObj(ARG_HEX_ORANGE);
      }
      default: {
        return {};
      }
    }
  };

  const getColStyle = (
    ref: string,
    style: any,
    existingStyle?: any,
    severityColor?: string
  ) => {
    return {
      ...(existingStyle || {}),
      ...style,
      ...getBgColorObj(ref, severityColor || ""),
      alignment: { wrapText: true, vertical: "top" }
    };
  };

  const getRowStyle = (
    rowNo: number,
    style?: any,
    existingStyleMap?: any,
    severityColor?: string,
    cols = ["A", "B", "C", "D", "E"]
  ) => {
    const localStyle = { ...(existingStyleMap || {}) };
    cols.forEach(col => {
      const celRef = `${col}${rowNo}`;
      localStyle[celRef] = getColStyle(
        celRef,
        style || {},
        localStyle[celRef] || {},
        severityColor
      );
    });
    return localStyle;
  };

  const getRows = (startRowNo = 1, cols = ["A", "B", "C", "D", "E"]) => {
    const borderStyleObj = { border: { top: { style: "thin" } } };
    let rowNo = startRowNo;
    let rows: any = [];
    let cellStyleMap: { [key: string]: any } = {};
    const mergeCells: {
      s: { r: number; c: number };
      e: { r: number; c: number };
    }[] = [];
    students
      .sort((st1, st2) => {
        return `${st1.StudentSurname}, ${st1.StudentGiven1}` >
          `${st2.StudentSurname}, ${st2.StudentGiven1}`
          ? 1
          : -1;
      })
      .forEach((student, sIndex) => {
        const studentArr = [
          `${student.StudentSurname}, ${student.StudentGiven1}`,
          student.StudentForm
        ];
        if (!(student.StudentID in conditionsMap)) {
          cellStyleMap = getRowStyle(rowNo, borderStyleObj, cellStyleMap);
          rows.push([...studentArr, "", "", ""]);
          rowNo = rowNo + 1;
          return;
        }

        if (conditionsMap[student.StudentID].length > 1) {
          mergeCells.push({
            s: { r: rowNo - 1, c: 0 },
            e: { r: rowNo + conditionsMap[student.StudentID].length - 2, c: 0 }
          });
          mergeCells.push({
            s: { r: rowNo - 1, c: 1 },
            e: { r: rowNo + conditionsMap[student.StudentID].length - 2, c: 1 }
          });
        }

        conditionsMap[student.StudentID].forEach((condition, index) => {
          const conditionArr = [
            condition.ConditionTypeDescription,
            condition.ConditionSeverityDescription,
            condition.ConditionDetails
          ];
          if (index === 0) {
            cellStyleMap = getRowStyle(
              rowNo,
              borderStyleObj,
              cellStyleMap,
              condition.ConditionSeverityDisplayColour
            );
            rows.push([...studentArr, ...conditionArr]);
          } else {
            cellStyleMap = getRowStyle(
              rowNo,
              undefined,
              cellStyleMap,
              condition.ConditionSeverityDisplayColour
            );
            rows.push(["", "", ...conditionArr]);
          }
          rowNo = rowNo + 1;
        });
      });
    return { rows, cellStyleMap, mergeCells };
  };

  const downloadExcel = () => {
    const titleRows: any = [
      [`Student Medical Plan Exported @ ${moment().format("DD/MMM/YYYY")}`],
      [`Name`, "Form", "Conditions"]
    ];

    const { rows, cellStyleMap, mergeCells } = getRows(3); //start from row 3, as there are two title rows
    const ws = XLSX.utils.aoa_to_sheet([...titleRows, ...rows]);

    ws["A1"].s = { font: { sz: 24 } };
    ["A2", "B2", "C2"].forEach(colRef => {
      ws[colRef].s = {
        font: { bold: true }
      };
    });

    Object.keys(cellStyleMap).forEach(firstCell => {
      if (firstCell in ws) {
        ws[firstCell].s = cellStyleMap[firstCell];
      }
    });

    ws["!cols"] = [
      { wch: 20 },
      { wch: 8 },
      { wch: 20 },
      { wch: 14 },
      { wch: 160 }
    ];

    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, ...mergeCells];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      `${moment().format("DD-MMM-YYYY_HH_mm_ss")}`
    );
    XLSX.writeFile(
      wb,
      `Student_Medical_Export_${moment().format("YYYY_MM_DD_HH_mm_ss")}.xlsx`
    );
  };

  return (
    <Wrapper>
      <Dropdown className={"ap-dropdown"}>
        <Dropdown.Toggle variant="primary" size={"sm"}>
          <Icons.Download /> Download
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => downloadExcel()}>
            <Icons.FileEarmarkExcel /> to excel
          </Dropdown.Item>
          <MedicalPosterGenBtn
            students={students}
            conditionsMap={conditionsMap}
            renderBtn={onClick => (
              <Dropdown.Item onClick={onClick}>
                <Icons.FilePdfFill /> gen poster
              </Dropdown.Item>
            )}
          />
        </Dropdown.Menu>
      </Dropdown>
    </Wrapper>
  );
};

export default MedicalReportExportDropdown;
