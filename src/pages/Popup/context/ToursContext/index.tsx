import React, { createContext, useContext, useReducer } from 'react';

import toursReducer, { type ToursAction, type ToursState } from './reducer';
import { Tour } from '../../../../types';

export const ToursContext = createContext<ToursState | null>(null);
export const ToursDispatchContext =
  createContext<React.Dispatch<ToursAction> | null>(null);

type Props = {
  children: React.ReactNode;
};

const initialTours: Array<Tour> = Array(0);

export const ToursProvider = ({ children }: Props) => {
  const [tours, toursDispatch] = useReducer(toursReducer, initialTours);

  return (
    <ToursContext.Provider value={tours}>
      <ToursDispatchContext.Provider value={toursDispatch}>
        {children}
      </ToursDispatchContext.Provider>
    </ToursContext.Provider>
  );
};

export const useTours = () => {
  const object = useContext(ToursContext);

  if (!object) {
    throw new Error('useTours must be used within a ToursProvider');
  }
  return object;
};

export const useToursDispatch = () => {
  const object = useContext(ToursDispatchContext);

  if (!object) {
    throw new Error('useToursDispatch must be used within a ToursProvider');
  }
  return object;
};
