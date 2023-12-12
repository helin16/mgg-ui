import ReactDOM from "react-dom";
import React, {ReactComponentElement} from "react";
import OnlineDonation from './pages/OnlineDonation/OnlineDonation';
import {ToastContainer} from 'react-toastify';
import AlumniRegistrationForm from './pages/alumni/components/AlumniRegistrationForm';
import {URL_STUDENT_REPORT_SCHOOL_BOX_ID} from './Url';
import UtilsService from './services/UtilsService';

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

const loadAll = () => {
  load(
    '[mgg-app-loader="online-donation"]',
    getElement(<OnlineDonation />)
  );

  load(
    '[mgg-app-loader="alumni-reg-form"]',
    getElement(<AlumniRegistrationForm />)
  );

  // Student Academic Report
  const urlPattern = /\/user\/profile\/documents\/reports\/\d+$/;
  document.querySelectorAll('a').forEach(element => {
    const match = `${element.href || ''}`.trim().match(urlPattern);
    if (`${element.textContent || ''}`.trim().includes('Academic Reports') && match !== null) {
      const studentSchoolBoxId = match[1];
      const newUrl = URL_STUDENT_REPORT_SCHOOL_BOX_ID.replace(':schoolBoxId', studentSchoolBoxId);
      element.href = UtilsService.getModuleUrl(newUrl);
    }
  });
}

const LoadComponents = {
  loadAll,
}

export default LoadComponents;
