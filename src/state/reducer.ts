import { ITbState } from '../types';
import * as Actions from './actions';

export const tbInitialState: ITbState = {
    aggregate: {},
    data: [],
    columns: [],
    error: null,
    filteredRecordCount: -1,
    initialized: false,
    isLoading: false,
    itemsPerPage: -1,
    page: -1,
    searchText: null,
    storage: null,
    totalRecordCount: -1,
};

export const tbReducer = (state: ITbState = tbInitialState, action: Actions.Actions): ITbState => {
    switch (action.type) {
        case Actions.GOTO_PAGE: {
            return { ...state, page: action.payload };
        }
        case Actions.START_REQUEST: {
            return { ...state, isLoading: true };
        }
        case Actions.INIT_GRID_FROM_STORAGE: {
            return { ...state, ...action.payload, initialized: true };
        }
        case Actions.REQUEST_ERROR: {
            return { ...state, error: action.payload, isLoading: false };
        }
        case Actions.REQUEST_SUCCESS: {
            return { ...state, ...action.payload, isLoading: false };
        }
        case Actions.SET_COLUMNS: {
            return { ...state, page: 0, columns: action.payload };
        }
        case Actions.UPDATE_ITEMS_PER_PAGE: {
            return { ...state, itemsPerPage: action.payload };
        }
        case Actions.UPDATE_SEARCH_TEXT: {
            return { ...state, page: 0, searchText: action.payload };
        }
        default:
            return state;
    }
};
