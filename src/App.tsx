import 'reflect-metadata';
import { Route, unstable_HistoryRouter as HistoryRouter, Navigate, Routes } from 'react-router-dom';
import { FC, Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import './assets/styles/index.css';
import { isUserAuthenticated, Pathes, routes } from './lib';
import LoadingFallback from './layout/LoadingFallback';
import { Provider } from 'react-redux';
import { store } from './store';
import HistoryProvider from './lib/providers/HistoryProvider';
import AuthProtectionProvider from './lib/providers/AuthProtectionProvider';
import RedirectionProvider from './lib/providers/RedirectionProvider';
import { createBrowserHistory } from 'history';
import { SnackbarProvider } from 'notistack';
import UserServiceConnectionSocketProvider from './lib/providers/userServiceConnectionSocketProvider';
import LogoutUserSocketEventProvider from './lib/providers/LogoutUserSocketEventProvider';
import ThemeProvider from './lib/providers/ThemeProvider';

export const history = createBrowserHistory();

const App: FC = () => {
  return (
    /**@ts-ignore */
    <HistoryRouter history={history}>
      <Provider store={store}>
        <RedirectionProvider>
          <ThemeProvider>
            <SnackbarProvider
              dense
              maxSnack={Infinity}
              anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
              style={{ maxWidth: '300px' }}
            >
              <HistoryProvider history={history}>
                <Routes>
                  {routes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        route.needAuth ? (
                          <AuthProtectionProvider>
                            <UserServiceConnectionSocketProvider>
                              <LogoutUserSocketEventProvider>
                                <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>
                              </LogoutUserSocketEventProvider>
                            </UserServiceConnectionSocketProvider>
                          </AuthProtectionProvider>
                        ) : (
                          <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>
                        )
                      }
                    />
                  ))}
                  <Route
                    path={Pathes.BANK}
                    element={<Navigate to={isUserAuthenticated() ? Pathes.DASHBOARD : Pathes.LOGIN} />}
                  />
                </Routes>
              </HistoryProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </RedirectionProvider>
      </Provider>
    </HistoryRouter>
  );
};

export default App;
