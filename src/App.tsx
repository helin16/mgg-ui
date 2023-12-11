import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SchoolBoxLayout from './layouts/SchoolBoxLayout';
import PageNotFound from './components/PageNotFound';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store, {RootState} from './redux/makeReduxStore';
import AppWrapper from './AppWrapper';
import './App.css';
import AssetPickupPage from './pages/assets/AssetPickupPage';
import {setIsProd} from './redux/reduxers/app.slice';
import PingService from './services/PingService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlumniRegistrationPage from './pages/alumni/AlumniRegistrationPage';
import {URL_ALUMNI_REGISTRATION, URL_ASSET_PICK_UP, URL_FUNNEL_THANK_YOU_PAGE, URL_ONLINE_DONATION} from './Url';
import OnlineDonationPage from './pages/OnlineDonation/OnlineDonationPage';
import FunnelThankYouPage from './pages/funnel/FunnelThankYouPage';
import PageNotFoundWithTechSupport from './components/PageNotFoundWithTechSupport';
import AcademicReportsForSchoolBoxId from './pages/studentReport/components/AcademicReportsForSchoolBoxId';

const Router = () => {
  const {isProd} = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  useEffect(() => {
    PingService.ping()
      .then(res => {
        dispatch(setIsProd({isProd: res.isProd === true, backendSchoolBoxUrl: res.schoolBoxUrl }));
      })
      .catch(() => {
        dispatch(setIsProd({isProd: false, backendSchoolBoxUrl: undefined}));
      })
  }, [dispatch])
  return (
    <AppWrapper className={isProd !== true ? 'test-app' : ''}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageNotFoundWithTechSupport />} />
          <Route path={URL_ASSET_PICK_UP} element={<AssetPickupPage />} />
          <Route path={URL_ALUMNI_REGISTRATION} element={<AlumniRegistrationPage />} />
          <Route path={URL_ONLINE_DONATION} element={<OnlineDonationPage />} />
          <Route path={URL_FUNNEL_THANK_YOU_PAGE} element={<FunnelThankYouPage />} />
          <Route path="/user/profile/documents/reports/:schoolBoxId" element={<AcademicReportsForSchoolBoxId  schoolBoxId={'5639'} />} />
          <Route path="/modules/remote/:code" element={<SchoolBoxLayout />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
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
