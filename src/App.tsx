import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SchoolBoxLayout from './layouts/SchoolBoxLayout';
import PageNotFound from './components/PageNotFound';
import {Provider} from 'react-redux';
import store from './redux/makeReduxStore';
import AppWrapper from './AppWrapper';
import './App.css';

const App = () => {
  return (
    <AppWrapper>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/modules/remote/:code" element={<SchoolBoxLayout />}>
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </Provider>
    </AppWrapper>
  );
}

export default App;
