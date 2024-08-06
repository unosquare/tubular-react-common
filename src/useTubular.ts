import * as React from 'react';
import {
    ColumnModel,
    CompareOperators,
    DataGridStorage,
    GridRequest,
    GridResponse,
    LocalStorage,
    NullStorage,
    sortColumnArray,
    TubularHttpClientAbstract,
} from 'tubular-common';
import { getLocalDataSource, getRemoteDataSource, tbId } from './helpers';
import { ITbApi } from './types/ITbApi';
import { ITbInstance } from './types/ITbInstance';
import { ITbOptions } from './types/ITbOptions';
import { actions } from './state/actions';
import { tbInitialState, tbReducer } from './state/reducer';
import { ITbState } from './types';

const getCurrentPage = (response: GridResponse, tbState: ITbState) => {
    const maxPage = Math.ceil(response.totalRecordCount / tbState.itemsPerPage);
    const currentPage = response.currentPage > maxPage ? maxPage : response.currentPage;
    return currentPage === 0 ? 0 : currentPage - 1;
};

const processRequest = async (
    tbState: ITbState,
    getAllRecords: () => (request: GridRequest) => Promise<GridResponse>,
) => {
    const response = await getAllRecords()(
        new GridRequest(tbState.columns, tbState.itemsPerPage, tbState.page, tbState.searchText ?? undefined),
    );

    return {
        page: getCurrentPage(response, tbState),
        aggregate: response.aggregationPayload,
        data: response.payload,
        filteredRecordCount: response.filteredRecordCount || 0,
        totalRecordCount: response.totalRecordCount || 0,
        columns: tbState.columns,
        error: null,
        searchText: tbState.searchText,
    };
};

const exportRows = async (
    tbState: ITbState,
    allRows: boolean,
    getAllRecords: () => (request: GridRequest) => Promise<GridResponse>,
) =>
    allRows
        ? (await getAllRecords()(new GridRequest(tbState.columns, -1, 0, tbState.searchText ?? undefined))).payload
        : tbState.data;

const alignColumn = (columns: ColumnModel[]) => (column: ColumnModel) => {
    const currentColumn = columns.find((col: ColumnModel) => col.name === column.name);

    if (!currentColumn) return;

    currentColumn.visible = column.visible;

    if (currentColumn.filterText !== null && column.filterOperator !== CompareOperators.None) return;

    currentColumn.filterText = column.filterText;
    currentColumn.filterOperator = column.filterOperator;
    currentColumn.filterArgument = column.filterArgument;
};

const getInitData = (tbState: ITbState, getStorage: DataGridStorage) => {
    const initData = {
        page: tbState.page,
        searchText: tbState.searchText,
        columns: tbState.columns,
    };
    if (getStorage.getPage()) initData.page = getStorage.getPage();

    if (getStorage.getTextSearch()) initData.searchText = getStorage.getTextSearch();

    const storedColumns = getStorage.getColumns();

    if (storedColumns) {
        const columns = [...tbState.columns];

        storedColumns.forEach(alignColumn(columns));

        initData.columns = columns;
    }

    return initData;
};

const createTbOptions = (tubularOptions?: Partial<ITbOptions>): ITbOptions => {
    const temp = tubularOptions || {};
    return {
        callbacks: temp.callbacks || {
            onError: () => {
                // Empty
            },
        },
        componentName: temp.componentName ?? tbId(),
        deps: temp.deps || null,
        pagination: temp.pagination || {
            itemsPerPage: 10,
            page: 0,
        },
        searchText: temp.searchText ?? '',
        storage: (temp.componentName && temp.storage) || new NullStorage(),
    };
};

const useTubular = (
    initColumns: ColumnModel[],
    source: unknown[] | string | Request | TubularHttpClientAbstract,
    tubularOptions?: Partial<ITbOptions>,
): ITbInstance => {
    const tbOptions = createTbOptions(tubularOptions);
    const { componentName, pagination, callbacks, storage, deps, searchText } = tbOptions;
    const initStorage = storage || new NullStorage();

    if (initStorage instanceof LocalStorage && componentName) {
        initStorage.setGridName(componentName);
    }

    const [tbState, dispatch] = React.useReducer(tbReducer, {
        ...tbInitialState,
        columns: initColumns,
        page: pagination?.page ?? 0,
        itemsPerPage: pagination?.itemsPerPage ?? 10,
        searchText: searchText ?? '',
    });
    const [getStorage] = React.useState<DataGridStorage>(initStorage);
    const [refresh, setRefresh] = React.useState(0);
    const forceRefresh = () => setRefresh((x) => x + 1);

    const getAllRecords = React.useCallback(
        () => (source instanceof Array ? getLocalDataSource(source) : getRemoteDataSource(source)),
        [source],
    );

    const api: ITbApi = {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        exportTo: async (
            allRows: boolean,
            exportFunc: (payload: unknown[] | undefined, columns: ColumnModel[]) => void,
        ) => {
            if (tbState.filteredRecordCount === 0) {
                return;
            }

            exportFunc(await exportRows(tbState, allRows, getAllRecords), tbState.columns);
        },
        goToPage: (page: number) => dispatch(actions.goToPage(page)),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        processRequest: async () => {
            dispatch(actions.startRequest());

            try {
                dispatch(actions.requestDone(await processRequest(tbState, getAllRecords)));
            } catch (err) {
                if (callbacks?.onError) callbacks.onError(err);

                dispatch(actions.requestError(err));
            }
        },
        reloadGrid: (resetPage = false) => {
            if (resetPage) dispatch(actions.goToPage(0));

            forceRefresh();
        },
        setColumns: (columns: ColumnModel[]) => dispatch(actions.setColumns(columns)),
        sortColumn: (property: string, multiSort = false) =>
            dispatch(actions.setColumns(sortColumnArray(property, [...tbState.columns], multiSort))),
        updateItemsPerPage: (itemsPerPage: number) => {
            if (tbState.itemsPerPage !== itemsPerPage) dispatch(actions.updateItemsPerPage(itemsPerPage));
        },
        updateSearchText: (value: string) => {
            if (tbState.searchText !== value) dispatch(actions.updateSearchText(value));
        },
    };

    const initGrid = () => dispatch(actions.initGridFromStorage(getInitData(tbState, getStorage)));
    const extraDependencies = deps || [];

    React.useEffect(() => {
        if (!tbState.initialized) initGrid();
    }, []);

    React.useEffect(() => {
        if (!tbState.isLoading && tbState.initialized) {
            api.processRequest();
        }
    }, [
        tbState.columns,
        tbState.page,
        tbState.searchText,
        tbState.itemsPerPage,
        tbState.initialized,
        refresh,
        source,
        ...extraDependencies,
    ]);

    React.useEffect(() => {
        dispatch(actions.setColumns(initColumns));
    }, [initColumns]);

    return {
        state: tbState,
        api,
    };
};

export default useTubular;
