import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type NotificationState = {
  show: boolean;
  title: string;
  message?: React.ReactNode;
  style: 'info' | 'success' | 'error';
};

type TitleAndMessage = Pick<NotificationState, 'title' | 'message'>;

const initialState: NotificationState = {
  show: false,
  title: '',
  message: '',
  style: 'info',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    hideNotification: (state) => {
      return {
        ...state,
        show: false,
      };
    },
    setNotification: (state, action: PayloadAction<TitleAndMessage>) => {
      return {
        ...state,
        show: true,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
    setErrorNotification: (state, action: PayloadAction<TitleAndMessage>) => {
      return {
        ...state,
        show: true,
        title: action.payload.title,
        message: action.payload.message,
        style: 'error',
      };
    },
  },
});

export const { hideNotification, setNotification, setErrorNotification } =
  notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
