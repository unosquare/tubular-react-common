import * as React from 'react';

import { ColumnModel, TubularHttpClientAbstract } from 'tubular-common';
import { ITbOptions } from './types/ITbOptions';
import { ITbTableInstance } from './types/ITbTableInstance';
import { useTubular } from './useTubular';

export const useTbTable = (
    initColumns: ColumnModel[],
    source: any[] | string | Request | TubularHttpClientAbstract,
    tubularOptions?: Partial<ITbOptions>,
): ITbTableInstance => {
    const tubular = useTubular(initColumns, source, tubularOptions);
    const [getMultiSort, setMultiSort] = React.useState(false);

    const handleKeyDown = (event: any) => {
        if (event.key === 'Control' && !getMultiSort) {
            setMultiSort(true);
        }
    };

    const handleKeyUp = (event: any) => {
        if (event.key === 'Control' && getMultiSort) {
            setMultiSort(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [getMultiSort]);

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
