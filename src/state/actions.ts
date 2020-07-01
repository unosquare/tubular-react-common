import { ActionsUnion, createAction } from './actionHelpers';
import { ColumnModel, CompareOperators } from 'tubular-common';

export const START_REQUEST = 'start request';
export const REQUEST_SUCCESS = 'request success';
export const REQUEST_ERROR = 'request error';
export const GOTO_PAGE = 'goto page';
export const SET_COLUMNS = 'set columns';
export const SET_FILTER = 'set filter';
export const SORT_COLUMN = 'sort column';
export const UPDATE_ITEMS_PER_PAGE = 'update items per page';
export const UPDATE_SEARCH_TEXT = 'update search text';
export const INIT_GRID_FROM_STORAGE = 'init grid from storage';

export const actions = {
    startRequest: () => createAction(START_REQUEST),
    goToPage: (payload: number) => createAction(GOTO_PAGE, payload),
    requestDone: (payload: {
        page: number;
        columns: ColumnModel[];
        searchText: string;
        aggregate: any;
        data: any[];
        filteredRecordCount: number;
        totalRecordCount: number;
        error: Error;
    }) => createAction(REQUEST_SUCCESS, payload),
    requestError: (payload: Error) => createAction(REQUEST_ERROR, payload),
    setColumns: (payload: ColumnModel[]) => createAction(SET_COLUMNS, payload),
    setFilter: (payload: { filterText: string; filterOperator: CompareOperators; filterArgument?: any[] }) =>
        createAction(SET_FILTER, payload),
    updateItemsPerPage: (payload: number) => createAction(UPDATE_ITEMS_PER_PAGE, payload),
    updateSearchText: (payload: string) => createAction(UPDATE_SEARCH_TEXT, payload),
    initGridFromStorage: (payload: { columns: ColumnModel[]; page: number; searchText: string }) =>
        createAction(INIT_GRID_FROM_STORAGE, payload),
};

export type Actions = ActionsUnion<typeof actions>;
