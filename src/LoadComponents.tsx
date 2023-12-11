import ReactDOM from "react-dom";
import React, {ReactComponentElement} from "react";
import OnlineDonation from './pages/OnlineDonation/OnlineDonation';
import {ToastContainer} from 'react-toastify';
import AlumniRegistrationForm from './pages/alumni/components/AlumniRegistrationForm';
import AcademicReportsForSchoolBoxId from './pages/studentReport/components/AcademicReportsForSchoolBoxId';

const load = (query: string, component: ReactComponentElement<any>) => {
  const roots = document.querySelectorAll(query) || [];
  // console.log('roots', roots);
  for (let i = 0; i < roots.length; i++) {
    ReactDOM.render(component, roots[i]);
  }
};

const loadAllElements = () => {
  load(
    '[mgg-app-loader="online-donation"]',
    // @ts-ignore
    <React.StrictMode>
      <OnlineDonation />
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
  );

  load(
    '[mgg-app-loader="alumni-reg-form"]',
    // @ts-ignore
    <React.StrictMode>
      <AlumniRegistrationForm />
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
  );

  // Student Academic Report
  const urlPattern = /^\/user\/profile\/documents\/reports\/\d+$/;
  const match = window.location.pathname.match(urlPattern);
  if (match) {
    const studentSchoolBoxId = match[1];
    load(
      '#content > .row > div:last-child"]',
      // @ts-ignore
      <React.StrictMode>
        <AcademicReportsForSchoolBoxId  schoolBoxId={studentSchoolBoxId} />
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
    );
  }
}

const loadAll = () => {
  document.addEventListener('DOMContentLoaded', function() {
    // Your code here
    console.log("Document is ready!");
    loadAllElements();
  });
}

const LoadComponents = {
  loadAll,
}

export default LoadComponents;
