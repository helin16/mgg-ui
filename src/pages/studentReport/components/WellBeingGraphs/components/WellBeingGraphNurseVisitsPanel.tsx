import styled from "styled-components";
import iVStudent from "../../../../../types/Synergetic/iVStudent";
import { useEffect, useState } from "react";
import SynVMedicalIncidentsAllService from "../../../../../services/Synergetic/SynVMedicalIncidentsAllService";
import { OP_BETWEEN, OP_NOT } from "../../../../../helper/ServiceHelper";
import Toaster from "../../../../../services/Toaster";
import { Spinner } from "react-bootstrap";
import iSynVMedicalIncidentsAll from "../../../../../types/Synergetic/Medical/iSynVMedicalIncidentsAll";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/makeReduxStore";
import moment from "moment-timezone";

const Wrapper = styled.div`
  text-align: center;
  background-color: rgb(12, 129, 48);
  color: white;
  padding: 1rem;
  .number-wrapper {
    margin-top: 1rem;
    position: relative;
    height: 90px;
    .number {
      position: absolute;
      width: 100%;
      text-align: center;
      top: 30px;
      color: rgb(12, 129, 48);
      z-index: 11;
    }
  }
  .number-wrapper::after {
    content: " ";
    position: absolute;
    display: block;
    background-color: #fff;
    height: 40px;
    margin-top: -20px;
    top: 50%;
    left: 30px;
    right: 30px;
    z-index: 9;
  }
  .number-wrapper::before {
    content: " ";
    position: absolute;
    display: block;
    background-color: #fff;
    width: 40px;
    margin-left: -20px;
    left: 50%;
    top: 0px;
    bottom: 0px;
    z-index: 9;
  }
`;
type iWellBeingGraphNurseVisitsPanel = {
  student: iVStudent;
};
const WellBeingGraphNurseVisitsPanel = ({
  student
}: iWellBeingGraphNurseVisitsPanel) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [incidents, setIncidents] = useState<iSynVMedicalIncidentsAll[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentYear =
    currentUser?.SynCurrentFileSemester?.FileYear || moment().year();

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    SynVMedicalIncidentsAllService.getAll({
      where: JSON.stringify({
        ID: student.StudentID,
        IncidentType: {
          [OP_NOT]: [
            "Meet",
            "Parent Corresp",
            "SEPEFIL",
            "WorkSafe Vic",
            "ALERT",
            "IAMP",
            "EpiPEN REPLACED",
            "MEDUPDATE"
          ]
        },
        IncidentDate: {
          [OP_BETWEEN]: ( currentUser?.SynCurrentFileSemester ? [
            currentUser?.SynCurrentFileSemester?.StartDate,
            currentUser?.SynCurrentFileSemester?.EndDate,
          ] : [
            `${currentYear}-01-01T00:00:00Z`,
            `${currentYear}-12-31T23:59:59Z`
          ])
        }
      }),
      perPage: 9999
    })
      .then(resp => {
        if (isCanceled) { return };
        setIncidents(resp.data || []);
      })
      .catch(err => {
        if (isCanceled) { return };
        Toaster.showApiError(err);
      })
      .then(() => {
        if (isCanceled) { return };
        setIsLoading(false);
      });
    return () => {
      isCanceled = true;
    }
  }, [student, currentUser, currentYear]);

  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={"border"} />;
    }
    return (
      <>
        <h6>Nurse Visits</h6>
        <h5 className={"number-wrapper"}>
          <div className={"number"}>{incidents.length}</div>
        </h5>
      </>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default WellBeingGraphNurseVisitsPanel;
