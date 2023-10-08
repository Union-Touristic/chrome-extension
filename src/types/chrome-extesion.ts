import { Tour } from '.';

export type ToursMessenger =
  | { type: 'retrieve' }
  | { type: 'init' }
  | { type: 'add'; data: Tour[] }
  | { type: 'update'; data: Tour[] }
  | { type: 'remove'; data: Tour['id'] | Tour['id'][] };
