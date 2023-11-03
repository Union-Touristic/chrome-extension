import React, { createContext, useContext, useEffect, useReducer } from 'react';

import authenticationReducer, {
  AuthenticationAction,
  type AuthenticationState,
} from './reducer';

export const Authentication = createContext<AuthenticationState | null>(null);
export const AuthenticationDispatchContext =
  createContext<React.Dispatch<AuthenticationAction> | null>(null);

const initialAuthentication: AuthenticationState = {
  isLoggedIn: false,
  csrftoken: null,
};

type Props = {
  children: React.ReactNode;
};

export const AuthenticationProvider = ({ children }: Props) => {
  const [authentication, authenticationDispatch] = useReducer(
    authenticationReducer,
    initialAuthentication
  );

  useEffect(function checkAuthentication() {
    (async () => {
      const cookies = await chrome.cookies.getAll({
        // TODO: change domain name for production
        domain: 'uniontouristic.vercel.app',
      });

      if (!cookies.length) return null;

      let hasSessionToken = false;
      let hasCsrfToken = false;
      let csrfToken: string | undefined;

      cookies.forEach((cookie) => {
        if (cookie.name.includes('session-token')) {
          hasSessionToken = true;
        }

        if (cookie.name.includes('csrf-token')) {
          hasCsrfToken = true;
          csrfToken = cookie.value;
        }
      });

      if (hasSessionToken && hasCsrfToken) {
        authenticationDispatch({ type: 'logged in', csrftoken: csrfToken! });
      }
    })();
  }, []);

  return (
    <Authentication.Provider value={authentication}>
      <AuthenticationDispatchContext.Provider value={authenticationDispatch}>
        {children}
      </AuthenticationDispatchContext.Provider>
    </Authentication.Provider>
  );
};

export const useAuthentication = () => {
  const object = useContext(Authentication);

  if (!object) {
    throw new Error(
      'useAuthentication must be used within a AuthenticationProvider'
    );
  }
  return object;
};
export const useAuthenticationDispatch = () => {
  const object = useContext(AuthenticationDispatchContext);

  if (!object) {
    throw new Error(
      'useAuthenticationDispatch must be used within a AuthenticationProvider'
    );
  }
  return object;
};
