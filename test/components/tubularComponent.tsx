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
                            .filter(col => col.Visible)
                            .map(col => {
                                return <th key={col.Name}>{col.Label}</th>;
                            })}
                    </tr>
                </thead>
                <tbody>
                    {state.data.map((row, index) => {
                        return (
                            <tr key={index}>
                                {state.columns
                                    .filter(col => col.Visible)
                                    .map(col => {
                                        return (
                                            <td role="cell" key={col.Name}>
                                                {row[col.Name]}
                                            </td>
                                        );
                                    })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};
