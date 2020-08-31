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
import { getLocalDataSource, tbId, getRemoteDataSource } from './helpers';
import { ITbApi } from './types/ITbApi';
import { ITbInstance } from './types/ITbInstance';
import { ITbOptions } from './types/ITbOptions';
import { actions } from './state/actions';
import { tbReducer, tbInitialState } from './state/reducer';

const createTbOptions = (tubularOptions?: Partial<ITbOptions>): ITbOptions => {
    const temp = tubularOptions || {};
    return {
        callbacks: temp.callbacks || {
            onError: () => {
                return;
            },
        },
        componentName: temp.componentName || tbId(),
        deps: temp.deps || null,
        pagination: temp.pagination || {
            itemsPerPage: 10,
            page: 0,
        },
        searchText: temp.searchText || '',
        storage: (temp.componentName && temp.storage) || new NullStorage(),
    };
};
export const useTubular = (
    initColumns: ColumnModel[],
    source: any[] | string | Request | TubularHttpClientAbstract,
    tubularOptions?: Partial<ITbOptions>,
): ITbInstance => {
    const tbOptions = createTbOptions(tubularOptions);

    const { componentName, pagination, callbacks, storage, deps, searchText } = tbOptions;

    const initStorage = storage || new NullStorage();
    if (initStorage instanceof LocalStorage) {
        initStorage.setGridName(componentName);
    }

    const [tbState, dispatch] = React.useReducer(tbReducer, {
        ...tbInitialState,
        columns: initColumns,
        page: pagination.page || 0,
        itemsPerPage: pagination.itemsPerPage || 10,
        searchText: searchText || '',
    });
    const [getStorage] = React.useState<DataGridStorage>(initStorage);
    const getAllRecords = React.useCallback(() => {
        return source instanceof Array ? getLocalDataSource(source) : getRemoteDataSource(source);
    }, [source]);

    const api: ITbApi = {
        exportTo: async (allRows: boolean, exportFunc: (payload: any[], columns: ColumnModel[]) => void) => {
            if (tbState.filteredRecordCount === 0) {
                return;
            }

            const payload = allRows
                ? (await getAllRecords()(new GridRequest(tbState.columns, -1, 0, tbState.searchText))).payload
                : tbState.data;

            exportFunc(payload, tbState.columns);
        },
        goToPage: (page: number) => {
            dispatch(actions.goToPage(page));
        },
        processRequest: async () => {
            dispatch(actions.startRequest());

            try {
                const request = new GridRequest(
                    tbState.columns,
                    tbState.itemsPerPage,
                    tbState.page,
                    tbState.searchText,
                );
                const response: GridResponse = await getAllRecords()(request);

                const maxPage = Math.ceil(response.totalRecordCount / tbState.itemsPerPage);
                let currentPage = response.currentPage > maxPage ? maxPage : response.currentPage;
                currentPage = currentPage === 0 ? 0 : currentPage - 1;

                dispatch(
                    actions.requestDone({
                        page: currentPage,
                        aggregate: response.aggregationPayload,
                        data: response.payload,
                        filteredRecordCount: response.filteredRecordCount || 0,
                        totalRecordCount: response.totalRecordCount || 0,
                        columns: tbState.columns,
                        error: null,
                        searchText: tbState.searchText,
                    }),
                );
            } catch (err) {
                if (callbacks.onError) {
                    callbacks.onError(err);
                }

                dispatch(actions.requestError(err));
            }
        },
        setColumns: (columns: ColumnModel[]) => dispatch(actions.setColumns(columns)),
        sortColumn: (property: string, multiSort = false) => {
            const columns = sortColumnArray(property, [...tbState.columns], multiSort);

            dispatch(actions.setColumns(columns));
        },
        updateItemsPerPage: (itemsPerPage: number) => {
            if (tbState.itemsPerPage !== itemsPerPage) {
                dispatch(actions.updateItemsPerPage(itemsPerPage));
            }
        },
        updateSearchText: (value: string) => {
            if (tbState.searchText !== value) {
                dispatch(actions.updateSearchText(value));
            }
        },
    };

    const memoDeps = React.useMemo(() => {
        return deps ? [...deps] : [];
    }, [deps]);

    const initGrid = () => {
        const initData = {
            page: tbState.page,
            searchText: tbState.searchText,
            columns: tbState.columns,
        };
        if (getStorage.getPage()) {
            initData.page = getStorage.getPage();
        }

        if (getStorage.getTextSearch()) {
            initData.searchText = getStorage.getTextSearch();
        }

        const storedColumns = getStorage.getColumns();

        if (storedColumns) {
            const columns = [...tbState.columns];

            storedColumns.forEach((column: ColumnModel) => {
                const currentColumn = columns.find((col: ColumnModel) => col.name === column.name);

                if (!currentColumn) {
                    return;
                }

                currentColumn.visible = column.visible;

                if (currentColumn.filterText !== null && column.filterOperator !== CompareOperators.None) {
                    return;
                }

                currentColumn.filterText = column.filterText;
                currentColumn.filterOperator = column.filterOperator;
                currentColumn.filterArgument = column.filterArgument;
            });

            initData.columns = columns;
        }

        dispatch(actions.initGridFromStorage(initData));
    };

    const dependencies = React.useMemo(() => {
        let tubularDeps = [
            tbState.columns,
            tbState.page,
            tbState.searchText,
            tbState.itemsPerPage,
            tbState.initialized,
            source,
        ];

        if (deps) {
            tubularDeps = tubularDeps.concat(deps);
        }

        return tubularDeps;
    }, [
        tbState.columns,
        tbState.page,
        tbState.searchText,
        tbState.itemsPerPage,
        tbState.initialized,
        source,
        ...memoDeps,
    ]);

    React.useEffect(() => {
        if (!tbState.initialized) {
            initGrid();
        }
    }, []);

    React.useEffect(() => {
        if (!tbState.isLoading && tbState.initialized) {
            api.processRequest();
        }
    }, dependencies);

    React.useEffect(() => {
        dispatch(actions.setColumns(initColumns));
    }, [initColumns]);

    const tbInstance = {
        state: tbState,
        api: React.useMemo(() => api, []),
    };

    return tbInstance;
};
