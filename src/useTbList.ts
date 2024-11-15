import * as React from 'react';
import type { ColumnModel, TubularHttpClientAbstract } from 'tubular-common';
import type { ITbListInstance } from './types/ITbListInstance';
import type { ITbOptions } from './types/ITbOptions';
import useTubular from './useTubular';

export default (
    initColumns: ColumnModel[],
    source: unknown[] | string | Request | TubularHttpClientAbstract,
    tubularOptions?: Partial<ITbOptions>,
): ITbListInstance => {
    const tubular = useTubular(initColumns, source, tubularOptions);
    const infiniteLoaderRef = React.useRef<{ resetLoadMoreRowsCache: (x: boolean) => void }>(null);

    const [list, setListState] = React.useState({
        hasNextPage: false,
        // We need to hold all the items that we have loaded
        // This will be a cumulated of all of the rows from tubular instance
        items: [] as unknown[],
    });

    // Reset list is required to flush cache from
    // Infinite loader
    const resetList = () => {
        if (infiniteLoaderRef.current) infiniteLoaderRef.current.resetLoadMoreRowsCache(true);

        setListState({ hasNextPage: false, items: [] });
        tubular.api.goToPage(0);
    };

    const sortByColumn = (columnName: string) => {
        resetList();
        tubular.api.sortColumn(columnName);
    };

    const search = (value: string) => {
        resetList();
        tubular.api.updateSearchText(value);
    };

    React.useEffect(() => {
        if (!tubular.state.data) return;

        setListState((state) => ({
            hasNextPage: state.items.length + (tubular.state.data?.length ?? 0) < tubular.state.filteredRecordCount,
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            items: [...state.items, ...tubular.state.data!],
        }));
    }, [tubular.state.data, tubular.state.filteredRecordCount]);

    return {
        // API fort a list should be simpler than
        // the one used for a grid
        api: {
            loadPage: tubular.api.goToPage,
            search,
            sortByColumn,
        },
        state: {
            ...tubular.state,
            // This is the ref that will be binded
            // to the actual infinite loader component
            infiniteLoaderRef,
            list,
        },
    };
};
