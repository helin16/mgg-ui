import ReactDOM from "react-dom";
import React, {ReactComponentElement} from "react";
import OnlineDonation from './pages/OnlineDonation/OnlineDonation';

const load = (query: string, component: ReactComponentElement<any>) => {
  const roots = document.querySelectorAll(query) || [];
  // console.log('roots', roots);
  for (let i = 0; i < roots.length; i++) {
    ReactDOM.render(component, roots[i]);
  }
};

const loadAll = () => {
  load(
    '.mgg-app.online-donation',
    // @ts-ignore
    <React.StrictMode>
      <OnlineDonation />
    </React.StrictMode>
  );
}

const LoadComponents = {
  loadAll,
}

export default LoadComponents;
