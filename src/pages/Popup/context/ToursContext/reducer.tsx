import type { Tour } from '../../../../types';

export type ToursState = Array<Tour>;

export type ToursAction = {
  type: 'update tours';
  tours: ToursState;
};

const toursReducer = (state: ToursState, action: ToursAction): ToursState => {
  switch (action.type) {
    case 'update tours':
      return action.tours;
    default:
      throw Error('Unknown action on toursReducer');
  }
};

export default toursReducer;
