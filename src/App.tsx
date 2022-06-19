import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SchoolBoxLayout from './layouts/SchoolBoxLayout';
import PageNotFound from './components/PageNotFound';
import {Provider, useSelector} from 'react-redux';
import store, {RootState} from './redux/makeReduxStore';
import AppWrapper from './AppWrapper';
import './App.css';
import AssetPickupPage from './pages/assets/AssetPickupPage';
import {Button} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const Router = () => {
  const {isProd} = useSelector((state: RootState) => state.app);
  return (
    <AppWrapper className={isProd !== true ? 'test-app' : ''}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <PageNotFound
              title={'Service Support'}
              description={'Mentone Girls\' Grammar Service Support'}
              primaryBtn={
                <Button variant="primary" href={'https://mentonegirls.vic.edu.au'}><Icon.HouseDoorFill /> {' '}Home</Button>
              }
              secondaryBtn={<div />}/>}
          />
          <Route path="/asset/pickup" element={<AssetPickupPage />} />
          <Route path="/modules/remote/:code" element={<SchoolBoxLayout />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AppWrapper>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

export default App;
