import type { Tour } from '@/lib/db/schema';
import { createContext, useContext, useReducer } from 'react';

export type ToursState = Array<Tour>;

export type ToursAction = {
  type: 'update tours';
  tours: ToursState;
};

export function toursReducer(
  state: ToursState,
  action: ToursAction
): ToursState {
  switch (action.type) {
    case 'update tours':
      return action.tours;
    default:
      throw Error('Unknown action on toursReducer');
  }
}

export const ToursContext = createContext<ToursState | null>(null);
export const ToursDispatchContext =
  createContext<React.Dispatch<ToursAction> | null>(null);

type Props = {
  children: React.ReactNode;
};

export function ToursProvider({ children }: Props) {
  const [tours, toursDispatch] = useReducer(toursReducer, []);

  return (
    <ToursContext.Provider value={tours}>
      <ToursDispatchContext.Provider value={toursDispatch}>
        {children}
      </ToursDispatchContext.Provider>
    </ToursContext.Provider>
  );
}

export function useToursState() {
  const object = useContext(ToursContext);

  if (!object) {
    throw new Error('useToursState must be used within a ToursProvider');
  }
  return object;
}

export function useToursDispatch() {
  const object = useContext(ToursDispatchContext);

  if (!object) {
    throw new Error('useToursDispatch must be used within a ToursProvider');
  }
  return object;
}

export function useTours() {
  return { tours: useToursState(), toursAction: useToursDispatch() };
}
