import * as React from 'react';
import { useTubular } from '../../src/useTubular';
import columns from '../fixtures/columns';
import localData from '../fixtures/localData';

export const TubularComponent = () => {
    const { state, api } = useTubular(columns, localData);
    return (
        <>
            <div>
                <button onClick={() => api.goToPage(state.page + 1)}>Go to next page</button>
                <button onClick={() => api.goToPage(state.page - 1)}>Go to previous page</button>
                <button onClick={() => api.sortColumn('CustomerName')}>Sort by Customer Name</button>
            </div>
            <table>
                <thead>
                    <tr role="rowheader">
                        {state.columns
                            .filter(col => col.visible)
                            .map(col => <th key={col.name}>{col.label}</th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {state.data.map((row, index) =>
                        <tr key={index}>
                                {state.columns
                                    .filter(col => col.visible)
                                    .map(col =>
                                        (
                                            <td role="cell" key={col.name}>
                                                {row[col.name]}
                                            </td>
                                        )
                                    )}
                            </tr>
                        )}
                </tbody>
            </table>
        </>
    );
};
