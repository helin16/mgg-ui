import ReactDOM from "react-dom";
import React, {ReactComponentElement} from "react";
import OnlineDonation from './pages/OnlineDonation/OnlineDonation';
import ClipboardConcussionAlert from './components/Clipboard/ClipboardConcussionAlert';
import {ToastContainer} from 'react-toastify';

const load = (query: string, component: ReactComponentElement<any>) => {
  const roots = document.querySelectorAll(query) || [];
  // console.log('roots', roots);
  for (let i = 0; i < roots.length; i++) {
    ReactDOM.render(component, roots[i]);
  }
};

const getElement = (element: any) => {
  return (
    // @ts-ignore
    <React.StrictMode>
      {element}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.StrictMode>
  )
}

const getAttendanceModifyUrlData = (pathname: string) => {
  const matched = pathname.match(/\/modules\/attendance\/modify\/(.+)\/(\d{4}-\d{2}-\d{2})\/([^/]+)\/([^/]+)\/([^/]+)\/?$/);
  if (!matched) {
    return null;
  }

  const classCode = decodeURIComponent(matched[1]);
  const currentDate = matched[2];
  const parsedPeriodNumber = Number(matched[3]);
  const campusCode = decodeURIComponent(matched[4]);

  const campusPrefix = `${campusCode}/`;
  const normalizedClassCode = classCode.startsWith(campusPrefix)
    ? classCode.substring(campusPrefix.length)
    : classCode;

  const periodNumber = Number.isFinite(parsedPeriodNumber) && parsedPeriodNumber > 0
    ? parsedPeriodNumber
    : 1;

  return {
    classCode: normalizedClassCode,
    currentDate,
    periodNumber,
  };
};

const loadStudentConussionAlertForAClassCode = () => {
  const attendanceUrlData = getAttendanceModifyUrlData(window.location.pathname);
  if (!attendanceUrlData) {
    return;
  }

  const container = document.querySelector('#container');
  if (!container) {
    return;
  }

  const attendanceTimeSteps = container.querySelector('#attendance-time-steps');
  if (!attendanceTimeSteps) {
    return;
  }

  let firstRowAfterAttendanceTimeSteps = attendanceTimeSteps.nextElementSibling;
  while (
    firstRowAfterAttendanceTimeSteps &&
    firstRowAfterAttendanceTimeSteps instanceof HTMLElement &&
    !firstRowAfterAttendanceTimeSteps.classList.contains('row')
  ) {
    firstRowAfterAttendanceTimeSteps = firstRowAfterAttendanceTimeSteps.nextElementSibling;
  }

  if (!firstRowAfterAttendanceTimeSteps || !firstRowAfterAttendanceTimeSteps.parentElement) {
    return;
  }

  const rootId = 'mgg-clipboard-concussion-alert-root';
  let root = container.querySelector(`#${rootId}`) as HTMLElement | null;
  if (!root) {
    root = document.createElement('div');
    root.id = rootId;
    firstRowAfterAttendanceTimeSteps.parentElement.insertBefore(root, firstRowAfterAttendanceTimeSteps.nextSibling);
  }

  ReactDOM.render(
    <ClipboardConcussionAlert
      classCode={attendanceUrlData.classCode}
      currentDate={attendanceUrlData.currentDate}
      periodNumber={attendanceUrlData.periodNumber}
    />,
    root
  );
}

const loadAll = () => {
  load(
    '[mgg-app-loader="online-donation"]',
    getElement(<OnlineDonation />)
  );

  loadStudentConussionAlertForAClassCode();
}

const LoadComponents = {
  loadStudentConussionAlertForAClassCode,
  loadAll,
}

export default LoadComponents;
