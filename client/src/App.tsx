import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useGeolocation from 'react-hook-geolocation';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { PublicOutletRoute } from '@/routes/publicRoutes';
import { publicRoutes } from '@/routes/publicRoutes/PublicRoutes';
import { ProtectedRoutes } from '@/routes/privateRoutes';
import { privateRoutes } from '@/routes/privateRoutes/PrivateRoutes';
import renderRoutes from '@/utils/common/renderRouter';
import { PUBLIC_ROUTES } from './utils/constant/routes';
import { useFetchUser } from './features/Authentications/services/authenService';
import {
  useCurrentLocationActions,
  useCurrentLocation
} from './components/Map';
import Modal from './components/Modal/Modal';
import AddLocationForm from './components/Modal/AddLocationForm/AddLocationForm';
import {
  useGetLinkZoom,
  useIsAuth,
  useModalCallDoctor,
  useUserActions
} from './stores/user.store';
import Loading from './components/Loading/Loading';
import ModalHasCall from './features/Doctors/BookingOnline/ModalHasCall';

const App = () => {
  const isAuth = useIsAuth();
  const modalCallData = useModalCallDoctor();
  const [isModalLocation, setIsModalLocation] = useState(false);
  const geolocation = useGeolocation();
  const { setCurrentLocation } = useCurrentLocationActions();
  const { isLocation, location } = useCurrentLocation();
  const { setIsAuth } = useUserActions();

  useEffect(() => {
    if (!geolocation.error && !isLocation) {
      setCurrentLocation({
        lng: geolocation.longitude,
        lat: geolocation.latitude
      });
    } else {
      setIsModalLocation(true);
    }
  }, [geolocation, setCurrentLocation, isLocation, location.lat]);

  const { data, isLoading, isSuccess } = useFetchUser();

  useEffect(() => {
    if (isSuccess) {
      if (data?.flag) {
        setIsAuth(true);
      }
    }
  }, [data?.flag, data?.user, isSuccess, setIsAuth]);

  return (
    <div className='App min-h-screen'>
      {isLoading && <Loading />}
      {modalCallData.isShow && (
        <Modal
          titleHeader='Có bệnh nhân muốn khám trực tuyến'
          isShow={modalCallData.isShow}
        >
          <ModalHasCall
            patient_channel={modalCallData.patient_channel}
            patient_id={modalCallData.patientId as string}
          />
        </Modal>
      )}

      {isSuccess && (
        <>
          {isAuth && isModalLocation && (
            <Modal isShow={isModalLocation}>
              <AddLocationForm />
            </Modal>
          )}

          <Router>
            <Routes>
              <Route element={<PublicOutletRoute />}>
                {renderRoutes(publicRoutes)}
              </Route>

              <Route
                element={
                  <ProtectedRoutes
                    isAuth={isAuth}
                    redirectPath={PUBLIC_ROUTES.login}
                  />
                }
              >
                {renderRoutes(privateRoutes)}
              </Route>
            </Routes>
          </Router>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
