import ReactDOM from "react-dom";
import React, {ReactComponentElement} from "react";
import OnlineDonation from './pages/OnlineDonation/OnlineDonation';
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

const loadAll = () => {
  load(
    '[mgg-app-loader="online-donation"]',
    getElement(<OnlineDonation />)
  );
}

const LoadComponents = {
  loadAll,
}

export default LoadComponents;
