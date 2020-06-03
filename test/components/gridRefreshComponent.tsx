import * as React from 'react';
import { useGridRefresh } from '../../src/useGridRefresh';
import columns from '../fixtures/columns';
import localData from '../fixtures/localData';

export const GridRefreshComponent = () => {
    const [refresh, setRefreshCounter] = useGridRefresh();
    return (
        <>
            <div>
                <span data-testid='refreshValue'>{ refresh }</span>
                <button onClick={()=>setRefreshCounter()}>Refresh</button>
            </div>
        </>
    );
};