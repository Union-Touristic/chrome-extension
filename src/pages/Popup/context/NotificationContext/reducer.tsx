import React from 'react';

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

export type NotificationType = {};

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

export default notificationReducer;
