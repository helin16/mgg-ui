import iVStudent from "../../../types/Synergetic/Student/iVStudent";
import iSynVMedicalConditionStudent from "../../../types/Synergetic/iSynVMedicalConditionStudent";
import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet
} from "@react-pdf/renderer";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import * as _ from 'lodash';
import UtilsService from '../../../services/UtilsService';

type iMedicalPoster = {
  students: iVStudent[];
  conditionsMap: { [key: number]: iSynVMedicalConditionStudent[] };
};
const MedicalPoster = ({
  students,
  conditionsMap,
  fileYear,
  fileSemester,
  conditionNames,
}: iMedicalPoster & { fileYear: number; fileSemester: number, conditionNames: string }) => {
  const styles = StyleSheet.create({
    page: { margin: 30 },
    header: {
      display: "flex",
      flexDirection: "row",
      paddingBottom: 20,
      justifyContent: "space-between",
      alignItems: 'center',
    },
    studentsDiv: { display: "flex", flexDirection: "row", flexWrap: "wrap" },
    studentDiv: {
      textAlign: "center",
      width: "18.7%",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10
    },
    studentTextDiv: { textAlign: "center", paddingTop: 7, fontSize: "9px" },
    studentTextRow: { paddingTop: 4 },
    pageNumber: {
      position: 'absolute',
      fontSize: 10,
      bottom: 50,
      left: 0,
      right: 0,
      textAlign: 'center',
    },
  });
  return (
    <Document>
      <Page size="A3" style={styles.page}>
        <View style={styles.header} fixed>
          <Image
            src={UtilsService.getFullUrl("images/mentone-logo-text.png")}
            style={{ width: "80px" }}
          />
          <View style={{ paddingRight: 55, textAlign: "right", width: "100%" }}>
            <Text style={{fontSize: 20}}>Students with {conditionNames}</Text>
            <Text style={{fontSize: 12, paddingTop: 5}}>
              File Year: {fileYear} Semester: {fileSemester}
            </Text>
          </View>
        </View>
        <View style={styles.studentsDiv}>
          {students.map(student => {
            return (
              <View style={styles.studentDiv}>
                <Image src={student.profileUrl} />
                <View style={styles.studentTextDiv}>
                  <Text>
                    {student.StudentSurname} {student.StudentGiven1} (
                    {student.StudentForm})
                  </Text>
                  {student.StudentID in conditionsMap
                    ? conditionsMap[student.StudentID].map(condition => {
                        return (
                          <Text
                            key={condition.MedicalConditionSeq}
                            style={styles.studentTextRow}
                          >
                            {condition.ConditionTypeDescription} -{" "}
                            {condition.ConditionSeverityDescription}
                          </Text>
                        );
                      })
                    : null}
                </View>
              </View>
            );
          })}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}    Generated At: ${moment().format('DD MMM YYYY')}`
        )} fixed />
      </Page>
    </Document>
  );
};

type iMedicalPosterGenBtn = iMedicalPoster & {
  renderBtn: (
    onClick: () => void,
    isLoading?: boolean
  ) => React.ReactElement | null;
};

const MedicalPosterGenBtn = ({
  renderBtn,
  students,
  conditionsMap
}: iMedicalPosterGenBtn) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const fileName = `Medical_condition_poster_${moment().format(
    "YYYY_MMM_DD_HH_ii_ss"
  )}.pdf`;

  const getFileYear = () => {
    if (students.length > 0) {
      return students[0].FileYear;
    }
    return currentUser?.SynCurrentFileSemester?.FileYear || moment().year()
  }

  const getFileSemester = () => {
    if (students.length > 0) {
      return students[0].FileSemester;
    }
    return currentUser?.SynCurrentFileSemester?.FileSemester ||1
  }

  const getConditions = () => {
    const conditionNames: string[] = []
    Object.values(conditionsMap).forEach(conditions => conditions.forEach(condition => {
      conditionNames.push(`${condition.ConditionTypeDescription || ''}`.trim())
    }));
    return _.uniq(conditionNames).filter(name => name !== '').join(', ');
  }

  return (
    <PDFDownloadLink
      document={
        <MedicalPoster
          students={students}
          conditionsMap={conditionsMap}
          conditionNames={getConditions()}
          fileYear={getFileYear()}
          fileSemester={getFileSemester()}
        />
      }
      fileName={fileName}
    >
      {props => {
        return renderBtn(() => {
          if (props.url) {
            window.open(props.url, fileName);
          }
        }, props.loading);
      }}
    </PDFDownloadLink>
  );
};

export default MedicalPosterGenBtn;
