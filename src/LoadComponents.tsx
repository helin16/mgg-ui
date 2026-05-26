import ReactDOM from "react-dom";
import React, {ReactComponentElement} from "react";
import OnlineDonation from './pages/OnlineDonation/OnlineDonation';
import ClipboardConcussionAlert from './components/Clipboard/ClipboardConcussionAlert';
import ClipboardStudentSessionAlert from './components/Clipboard/ClipboardStudentSessionAlert';
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

const loadStudentSessionAlertForAClassCode = () => {
  const attendanceUrlData = getAttendanceModifyUrlData(window.location.pathname);
  if (!attendanceUrlData) {
    return;
  }

  const container = document.querySelector('#container');
  if (!container) {
    return;
  }

  const sessionAlertRootId = 'mgg-clipboard-student-session-alert-root';
  let sessionAlertRoot = container.querySelector(`#${sessionAlertRootId}`) as HTMLElement | null;
  
  if (!sessionAlertRoot) {
    // Try to find concussion alert root first
    let insertBeforeElement = container.querySelector('#mgg-clipboard-concussion-alert-root');
    
    // If concussion alert root doesn't exist, find the first row after attendance-time-steps
    if (!insertBeforeElement) {
      const attendanceTimeSteps = container.querySelector('#attendance-time-steps');
      if (attendanceTimeSteps) {
        let firstRowAfterAttendanceTimeSteps = attendanceTimeSteps.nextElementSibling;
        while (
          firstRowAfterAttendanceTimeSteps &&
          firstRowAfterAttendanceTimeSteps instanceof HTMLElement &&
          !firstRowAfterAttendanceTimeSteps.classList.contains('row')
        ) {
          firstRowAfterAttendanceTimeSteps = firstRowAfterAttendanceTimeSteps.nextElementSibling;
        }
        insertBeforeElement = firstRowAfterAttendanceTimeSteps;
      }
    }

    if (insertBeforeElement && insertBeforeElement.parentElement) {
      sessionAlertRoot = document.createElement('div');
      sessionAlertRoot.id = sessionAlertRootId;
      insertBeforeElement.parentElement.insertBefore(sessionAlertRoot, insertBeforeElement.nextSibling);
    }
  }

  if (!sessionAlertRoot) {
    return;
  }

  ReactDOM.render(
    <ClipboardStudentSessionAlert
      classCode={attendanceUrlData.classCode}
      currentDate={attendanceUrlData.currentDate}
      periodNumber={attendanceUrlData.periodNumber}
      sessionTypeLabel="Clipboard Sessions"
    />,
    sessionAlertRoot
  );
}

const loadStudentSessionAlertBeforeFormSubmit = () => {
  const attendanceUrlData = getAttendanceModifyUrlData(window.location.pathname);
  if (!attendanceUrlData) {
    return;
  }

  const formSubmitElement = document.querySelector('#attendance-form-submit');
  if (!formSubmitElement || !formSubmitElement.parentElement) {
    return;
  }

  const sessionAlertRootId = 'mgg-clipboard-student-session-alert-before-submit-root';
  let sessionAlertRoot = document.querySelector(`#${sessionAlertRootId}`) as HTMLElement | null;
  
  if (!sessionAlertRoot) {
    sessionAlertRoot = document.createElement('div');
    sessionAlertRoot.id = sessionAlertRootId;
    sessionAlertRoot.style.marginBottom = '1rem';
    formSubmitElement.parentElement.insertBefore(sessionAlertRoot, formSubmitElement);
  }

  if (!sessionAlertRoot) {
    return;
  }

  ReactDOM.render(
    <ClipboardStudentSessionAlert
      classCode={attendanceUrlData.classCode}
      currentDate={attendanceUrlData.currentDate}
      periodNumber={attendanceUrlData.periodNumber}
      sessionTypeLabel="Clipboard Sessions"
    />,
    sessionAlertRoot
  );
}

const loadAll = () => {
  load(
    '[mgg-app-loader="online-donation"]',
    getElement(<OnlineDonation />)
  );

  loadStudentConussionAlertForAClassCode();
  loadStudentSessionAlertForAClassCode();
  loadStudentSessionAlertBeforeFormSubmit();
}

const LoadComponents = {
  loadStudentConussionAlertForAClassCode,
  loadStudentSessionAlertForAClassCode,
  loadStudentSessionAlertBeforeFormSubmit,
  loadAll,
}

export default LoadComponents;
