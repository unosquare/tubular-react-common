import * as React from 'react';
import * as ReactDom from 'react-dom';
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

    const [isLoading, setIsLoading] = React.useState(false);
    const [getColumns, setColumns] = React.useState<ColumnModel[]>(initColumns);
    const [isStorageLoaded, setIsStorageLoaded] = React.useState(false);
    const [getActiveColumn, setActiveColumn] = React.useState<ColumnModel>(null);
    const [getItemsPerPage, setItemsPerPage] = React.useState<number>(pagination.itemsPerPage || 10);
    const [getStorage] = React.useState<DataGridStorage>(initStorage);
    const [getPage, setPage] = React.useState<number>(pagination.page || 0);
    const [getSearchText, setSearchText] = React.useState<string>(searchText || '');
    const [getError, setError] = React.useState(null);
    const getAllRecords = source instanceof Array ? getLocalDataSource(source) : getRemoteDataSource(source);

    const [getState, setState] = React.useState({
        aggregate: null,
        data: [],
        filteredRecordCount: 0,
        totalRecordCount: 0,
    });

    const api: ITbApi = {
        exportTo: async (allRows: boolean, exportFunc: (payload: any[], columns: ColumnModel[]) => void) => {
            if (getState.filteredRecordCount === 0) {
                return;
            }

            const payload = allRows
                ? (await getAllRecords(new GridRequest(getColumns, -1, 0, getSearchText))).payload
                : getState.data;

            exportFunc(payload, getColumns);
        },
        goToPage: (page: number) => {
            if (getPage !== page) {
                setPage(page);
            }
        },
        handleFilterChange: (filterText: string, filterOperator: CompareOperators, filterArgument?: any[]) => {
            setActiveColumn({
                ...getActiveColumn,
                filterText,
                filterOperator,
                filterArgument,
            });
        },
        processRequest: async () => {
            setIsLoading(true);

            try {
                const request = new GridRequest(getColumns, getItemsPerPage, getPage, getSearchText);
                const response: GridResponse = await getAllRecords(request);

                const maxPage = Math.ceil(response.totalRecordCount / getItemsPerPage);
                let currentPage = response.currentPage > maxPage ? maxPage : response.currentPage;
                currentPage = currentPage === 0 ? 0 : currentPage - 1;

                // TODO: Check this won't case an issue
                ReactDom.unstable_batchedUpdates(() => {
                    getStorage.setPage(currentPage);
                    getStorage.setColumns(getColumns);
                    getStorage.setTextSearch(getSearchText);

                    setState({
                        aggregate: response.aggregationPayload,
                        data: response.payload,
                        filteredRecordCount: response.filteredRecordCount || 0,
                        totalRecordCount: response.totalRecordCount || 0,
                    });

                    setIsLoading(false);
                    setError(null);
                    setPage(currentPage);
                });
            } catch (err) {
                if (callbacks.onError) {
                    callbacks.onError(err);
                }

                setIsLoading(false);
                setError(err);
            }
        },
        setActiveColumn,
        setColumns,
        setFilter: (filterText: string, filterOperator: CompareOperators, filterArgument?: any[]) => {
            const columns = [...getColumns];
            const column = columns.find((c: ColumnModel) => c.name === getActiveColumn.name);
            if (!column) {
                return;
            }
            column.filterText = filterText;
            column.filterOperator = filterOperator;
            column.filterArgument = filterArgument;

            setColumns([...columns]);
        },
        sortColumn: (property: string, multiSort = false) => {
            const columns = sortColumnArray(property, [...getColumns], multiSort);

            setColumns(columns);
        },
        updateItemPerPage: (itemsPerPage: number) => {
            if (getItemsPerPage !== itemsPerPage) {
                setItemsPerPage(itemsPerPage);
            }
        },
        updateSearchText: (value: string) => {
            if (getSearchText !== value) {
                setSearchText(value);
            }
        },
    };

    let dependencies = [getColumns, getPage, getSearchText, getItemsPerPage, source];

    if (deps) {
        dependencies = dependencies.concat(deps);
    }

    const initGrid = () => {
        if (getStorage.getPage()) {
            setPage(getStorage.getPage());
        }

        if (getStorage.getTextSearch()) {
            setSearchText(getStorage.getTextSearch());
        }

        const storedColumns = getStorage.getColumns();

        if (storedColumns) {
            const columns = [...getColumns];

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

            setColumns(columns);
        }

        setIsStorageLoaded(true);
    };

    if (!isStorageLoaded) {
        initGrid();
    }

    React.useEffect(() => {
        if (!isLoading) {
            api.processRequest();
        }
    }, dependencies);

    React.useEffect(() => {
        setColumns(initColumns);
    }, [initColumns]);

    const state = {
        ...getState,
        activeColumn: getActiveColumn,
        columns: getColumns,
        error: getError,
        initialized: isStorageLoaded,
        isLoading,
        itemsPerPage: getItemsPerPage,
        page: getPage,
        searchText: getSearchText,
        storage: getStorage,
    };

    return { state, api };
};
