import ReactDOM from "react-dom";
import React, {ReactComponentElement} from "react";

const load = (query: string, component: ReactComponentElement<any>) => {
  const roots = document.querySelectorAll(query) || [];
  for (let i = 0; i < roots.length; i++) {
    ReactDOM.render(component, roots[i]);
  }
};

const loadAll = () => {
  load(
    '.mgg-app.test-div',
    // @ts-ignore
    <React.StrictMode>
      <div>MGG App Loaded.</div>
    </React.StrictMode>
  );
}

export default {
  loadAll
};
