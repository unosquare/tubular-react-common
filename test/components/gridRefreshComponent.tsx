import * as React from 'react';
import { useGridRefresh } from '../../src/useGridRefresh';

export const GridRefreshComponent = () => {
    const [refresh, setRefreshCounter] = useGridRefresh();
    return (
        <div>
            <span data-testid='refreshValue'>{ refresh }</span>
            <button onClick={setRefreshCounter}>Refresh</button>
        </div>
    );
};