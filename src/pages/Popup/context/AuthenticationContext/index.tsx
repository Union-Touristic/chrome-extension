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
      // const cookies = await chrome.cookies.getAll({
      //   domain: '127.0.0.1',
      // });
      // console.log('It works');
      // const cookiesNames = cookies.map((cookie) => cookie.name);
      // const hasCsrfToken = cookiesNames.includes('csrftoken');
      // const hasSessionId = cookiesNames.includes('sessionid');
      // if (hasCsrfToken && hasSessionId) {
      //   authenticationDispatch({
      //     type: 'logged in',
      //     csrftoken: cookies.filter((item) => item.name === 'csrftoken')[0]
      //       .value,
      //   });
      // }
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
