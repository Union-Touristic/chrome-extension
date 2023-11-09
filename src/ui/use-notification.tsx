import { createContext, useContext, useReducer } from 'react';

export type NotificationState = {
  show: boolean;
  title: string;
  message?: React.ReactNode;
  style: 'info' | 'success' | 'error';
};

export type NotificationAction =
  | {
      type: 'add';
      title: string;
      message?: React.ReactNode;
    }
  | {
      type: 'remove';
    }
  | {
      type: 'add error notification';
      title: string;
      message?: React.ReactNode;
    };

const notificationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case 'remove':
      return {
        ...state,
        show: false,
      };
    case 'add':
      return {
        ...state,
        show: true,
        title: action.title,
        message: action.message,
      };
    case 'add error notification':
      return {
        ...state,
        show: true,
        title: action.title,
        message: action.message,
        style: 'error',
      };
    default:
      throw Error('Unknown action on notificationReducer');
  }
};

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
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
};

export function useNotificationState() {
  const object = useContext(NotificationContext);

  if (!object) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return object;
}

export const useNotificationDispatch = () => {
  const object = useContext(NotificationDispatchContext);

  if (!object) {
    throw new Error(
      'useNotificationDispatch must be used within a NotificationProvider'
    );
  }
  return object;
};

export function useNotification() {
  return {
    notification: useNotificationState(),
    notificationAction: useNotificationDispatch(),
  };
}
