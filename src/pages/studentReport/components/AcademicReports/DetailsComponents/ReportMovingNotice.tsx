import { Alert, Button, Spinner } from "react-bootstrap";
import iVStudent from "../../../../../types/Synergetic/Student/iVStudent";
import { CAMPUS_CODE_SENIOR } from "../../../../../types/Synergetic/Lookup/iSynLuCampus";
import { useEffect, useState } from "react";
import SBUserService from "../../../../../services/SchoolBox/SBUserService";
import iSBUser from "../../../../../types/SchoolBox/iSBUser";
import Toaster from "../../../../../services/Toaster";

type iReportMovingNotice = {
  student: iVStudent;
};
const ReportMovingNotice = ({ student }: iReportMovingNotice) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sbStudent, setSbStudent] = useState<iSBUser | null>(null);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    SBUserService.getAll({
      where: JSON.stringify({
        synergy_id: student.StudentID
      })
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const sbUsers = resp.data || [];
        setSbStudent(sbUsers.length > 0 ? sbUsers[0] : null);
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
  }, [student.StudentID]);

  const getNavBtn = () => {
    if (isLoading) {
      return <Spinner />;
    }
    if (!sbStudent) {
      return (
        <Button href={`#`} disabled>
          System couldn't get the SchoolBox account for{" "}
          {student.StudentNameInternal}.
        </Button>
      );
    }
    return (
      <Button href={`/user/profile/documents/reports/${sbStudent.id}`}>
        click to view there
      </Button>
    );
  };

  if (student.StudentCampus !== CAMPUS_CODE_SENIOR) {
    return null;
  }
  return (
    <Alert variant={"warning"} dismissible>
      <Alert.Heading>
        The Online Reports module has been decommissioned for Senior School.
      </Alert.Heading>
      <div style={{ marginBottom: "1rem" }}>
        Student reports are now available on student profiles under the Academic
        Reports button.
      </div>
      {getNavBtn()}
    </Alert>
  );
};

export default ReportMovingNotice;
