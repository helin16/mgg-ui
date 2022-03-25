import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SchoolBoxLayout from './layouts/SchoolBoxLayout';
import PageNotFound from './components/PageNotFound';
import {Provider} from 'react-redux';
import store from './redux/makeReduxStore';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/modules/remote/:code" element={<SchoolBoxLayout />}>
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
