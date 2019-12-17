import * as React from 'react';

export const useGridRefresh = (): [number, () => void] => {
    const [refresh, setRefreshCounter] = React.useState(0);

    return [
        refresh,
        () => {
            setRefreshCounter(refresh + 1);
        },
    ];
};
