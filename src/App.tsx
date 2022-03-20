import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom';
import SchoolBoxLayout from './layouts/SchoolBoxLayout';
import PageNotFound from './components/PageNotFound';

const SchoolBoxRouter = () => {
  const {code} = useParams();
  const remoteUrl = document.getElementById("mgg-root")?.getAttribute('data-url') || atob(code || '');
  try {
    // @ts-ignore
    const url = new URL(remoteUrl);
    const newPath = url.pathname.replace('/3rdPartyAuth/', '');
    const finalPath = atob(newPath || '');
    return <div><div>remoteUrl: {remoteUrl}</div><div>finalPath: '{finalPath}'</div></div>;
  } catch (e) {
    return <div>Error: can't get the url.</div>
  }
}

const Test = () => {
  return <h2>Student Report</h2>;
}


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/modules/remote/" element={<SchoolBoxLayout />}>
          <Route path=":code" element={<Test />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
