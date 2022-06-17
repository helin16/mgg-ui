import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SchoolBoxLayout from './layouts/SchoolBoxLayout';
import PageNotFound from './components/PageNotFound';
import {Provider, useSelector} from 'react-redux';
import store, {RootState} from './redux/makeReduxStore';
import AppWrapper from './AppWrapper';
import './App.css';
import AssetPickupPage from './pages/assets/AssetPickupPage';

const Router = () => {
  const {isProd} = useSelector((state: RootState) => state.app);
  return (
    <AppWrapper className={isProd !== true ? 'test-app' : ''}>
      <BrowserRouter>
        <Routes>
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
