import React, { createContext, useContext, useReducer } from 'react';

import notificationReducer, {
  type NotificationState,
  NotificationAction,
} from './reducer';
import Notification from '../../components/Notification';

export const NotificationContext = createContext<NotificationState | null>(
  null
);
export const NotificationDispatchContext =
  createContext<React.Dispatch<NotificationAction> | null>(null);

const initialState: NotificationState = {
  show: false,
  title: '',
  message: '',
  style: 'info',
};

type Props = {
  children: React.ReactNode;
};

export const NotificationProvider = ({ children }: Props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    initialState
  );

  return (
    <NotificationContext.Provider value={notification}>
      <NotificationDispatchContext.Provider value={notificationDispatch}>
        {children}
        <Notification />
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const object = useContext(NotificationContext);

  if (!object) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return object;
};

export const useNotificationDispatch = () => {
  const object = useContext(NotificationDispatchContext);

  if (!object) {
    throw new Error(
      'useNotificationDispatch must be used within a NotificationProvider'
    );
  }
  return object;
};
