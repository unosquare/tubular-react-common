import * as React from 'react';
import { useTbTable } from '../../src';
import columns from '../fixtures/columns';
import localData from '../fixtures/localData';

export const TbTableComponent = () => {
    const { state, api } = useTbTable(columns, localData);
    return (
        <>
            <div>
                <button onClick={() => api.sortColumn('CustomerName')}>Sort by Customer Name</button>
            </div>
            <table>
                <thead>
                    <tr role="rowheader">
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
                                    <td role="cell" key={col.name}>
                                        {row[col.name]}
                                    </td>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};
