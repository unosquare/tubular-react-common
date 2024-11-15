import * as React from 'react';
import type { ColumnModel, TubularHttpClientAbstract } from 'tubular-common';
import type { ITbOptions } from './types/ITbOptions';
import type { ITbTableInstance } from './types/ITbTableInstance';
import useTubular from './useTubular';

export default (
    initColumns: ColumnModel[],
    source: unknown[] | string | Request | TubularHttpClientAbstract,
    tubularOptions?: Partial<ITbOptions>,
): ITbTableInstance => {
    const tubular = useTubular(initColumns, source, tubularOptions);
    const [getMultiSort, setMultiSort] = React.useState(false);

    const handleKeyDown = React.useCallback(
        (event: { key: unknown }) => {
            if (event.key === 'Control' && !getMultiSort) setMultiSort(true);
        },
        [getMultiSort],
    );

    const handleKeyUp = React.useCallback(
        (event: { key: unknown }) => {
            if (event.key === 'Control' && getMultiSort) setMultiSort(false);
        },
        [getMultiSort],
    );

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [getMultiSort, handleKeyDown, handleKeyUp]);

    return {
        api: {
            ...tubular.api,
            sortColumn: (colName: string) => {
                tubular.api.sortColumn(colName, getMultiSort);
            },
        },
        state: tubular.state,
    };
};
