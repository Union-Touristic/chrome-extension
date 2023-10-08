import { SortConfig, Tour } from '../../../../types';

export type TableState = {
  sortConfig: SortConfig | null;
  checked: boolean;
  indeterminate: boolean;
  selectedRows: Array<Tour['id']>;
};

export type TableAction =
  | {
      type: 'set sort config';
      config: TableState['sortConfig'];
    }
  | {
      type: 'selected rows changed';
      checked: TableState['checked'];
      indeterminate: TableState['indeterminate'];
    }
  | {
      type: 'toggle all';
      selectedRows: TableState['selectedRows'];
      checked: TableState['checked'];
      indeterminate: TableState['indeterminate'];
    }
  | {
      type: 'select all';
      selectedRows: TableState['selectedRows'];
    }
  | {
      type: 'update selected rows';
      selectedRows: TableState['selectedRows'];
    };

const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'set sort config':
      return {
        ...state,
        sortConfig: action.config,
      };
    case 'selected rows changed':
      return {
        ...state,
        checked: action.checked,
        indeterminate: action.indeterminate,
      };
    case 'toggle all':
      return {
        ...state,
        selectedRows: action.selectedRows,
        checked: action.checked,
        indeterminate: action.indeterminate,
      };
    case 'select all':
      return {
        ...state,
        selectedRows: action.selectedRows,
        checked: true,
        indeterminate: false,
      };
    case 'update selected rows':
      return {
        ...state,
        selectedRows: action.selectedRows,
      };
    default:
      throw Error('Unknown action on tableReducer');
  }
};

export default tableReducer;
