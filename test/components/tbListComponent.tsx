import * as React from 'react';
import { useTbList } from '../../src';
import columns from '../fixtures/columns';
import localData from '../fixtures/localData';

export const TbListComponent = () => {
    const { state, api } = useTbList(columns, localData);
    return (
        <>
            <div>
                <button onClick={() => api.loadPage(1)}>Go to page 2</button>
                <button onClick={() => api.search('Microsoft')}>Search</button>
                <button onClick={() => api.sortByColumn('CustomerName')}>Sort by Customer Name</button>
            </div>
            {state.isLoading && <div data-testid='loader'>Loading</div>}
            <table>
                <thead>
                    <tr>
                        {state.columns
                            .filter((col) => col.visible)
                            .map((col) => (
                                <th key={col.name}>{col.label}</th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {state.data.map((row, index) => (
                        <tr key={index}>
                            {state.columns
                                .filter((col) => col.visible)
                                .map((col) => (
                                    <td key={col.name}>{row[col.name]}</td>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};
