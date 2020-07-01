import { ITbState } from '../types';
import * as Actions from './actions';
const initialState: ITbState = {
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

export const tbReducer = (state: ITbState = initialState, action: Actions.Actions) => {
    switch (action.type) {
        case Actions.GOTO_PAGE: {
            if (state.page !== action.payload) {
                return { ...state, page: action.payload };
            }
        }
        default:
            return state;
    }
};
