import * as React from 'react';

export default (): [number, () => void] => {
    const [refresh, setRefreshCounter] = React.useState(0);

    return [
        refresh,
        () => {
            setRefreshCounter(refresh + 1);
        },
    ];
};
