import styled from "styled-components";
import iVStudent from "../../../../../types/Synergetic/iVStudent";
import { useEffect, useState } from "react";
import SynVMedicalIncidentsAllService from "../../../../../services/Synergetic/SynVMedicalIncidentsAllService";
import {OP_BETWEEN, OP_NOT, OP_OR} from "../../../../../helper/ServiceHelper";
import Toaster from "../../../../../services/Toaster";
import { Spinner } from "react-bootstrap";
import iSynVMedicalIncidentsAll from "../../../../../types/Synergetic/Medical/iSynVMedicalIncidentsAll";
import iSynFileSemester from '../../../../../types/Synergetic/iSynFileSemester';

const green = '#0C8130';
const Wrapper = styled.div`
  text-align: center;
  background-color: ${green};
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
      top: 25px;
      color: rgb(0, 102,0);
      z-index: 11;
      font-size: 34px;
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
  className?: string;
  fileSemesters: iSynFileSemester[];
};
const WellBeingGraphNurseVisitsPanel = ({
  student, className, fileSemesters = []
}: iWellBeingGraphNurseVisitsPanel) => {
  const [incidents, setIncidents] = useState<iSynVMedicalIncidentsAll[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fileSemesters.length <= 0) {
      setIncidents([]);
      return;
    }
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
        [OP_OR]: fileSemesters.map(selectedFileSemester => {
          return {
            IncidentDate: {
              [OP_BETWEEN]: [
                selectedFileSemester.StartDate,
                selectedFileSemester.EndDate,
              ]
            }
          }
        }),
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
  }, [student, fileSemesters]);

  const getContent = () => {
    if (isLoading === true) {
      return <Spinner animation={"border"} />;
    }
    return (
      <>
        <h6 style={{color: 'white'}}>Nurse Visits</h6>
        <h5 className={"number-wrapper"}>
          <div className={"number"}>{incidents.length}</div>
        </h5>
      </>
    );
  };

  return <Wrapper className={className}>{getContent()}</Wrapper>;
};

export default WellBeingGraphNurseVisitsPanel;
