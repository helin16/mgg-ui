import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SchoolBoxLayout from './layouts/SchoolBoxLayout';
import PageNotFound from './components/PageNotFound';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store, {RootState} from './redux/makeReduxStore';
import AppWrapper from './AppWrapper';
import './App.css';
import AssetPickupPage from './pages/assets/AssetPickupPage';
import {Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import {setIsProd} from './redux/reduxers/app.slice';
import PingService from './services/PingService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Router = () => {
  const {isProd} = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  useEffect(() => {
    PingService.ping()
      .then(res => {
        dispatch(setIsProd({isProd: res.isProd === true}));
      })
      .catch(() => {
        dispatch(setIsProd({isProd: false}));
      })
  }, [dispatch])
  return (
    <AppWrapper className={isProd !== true ? 'test-app' : ''}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <PageNotFound
              title={'Service Support'}
              description={'Mentone Girls\' Grammar Service Support'}
              primaryBtn={
                <Button variant="primary" href={'https://mentonegirls.vic.edu.au'}>
                  <Icon.HouseDoorFill /> {' '}Home
                </Button>
              }
              secondaryBtn={<div />}/>}
          />
          <Route path="/asset/pickup" element={<AssetPickupPage />} />
          <Route path="/modules/remote/:code" element={<SchoolBoxLayout />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
