import * as React from 'react';
import { useTbSelection, useTbTable } from '../../src';
import columns from '../fixtures/columns';
import localData from '../fixtures/localData';

export const TbTableComponent = () => {
    const { state, api } = useTbTable(columns, localData);
    const selection = useTbSelection({ state, api }, true);
    const toggleFirstRowSelect = () => {
        const firstRow = state.data[0];
        selection.toggleRowSelection(firstRow[columns.find((c) => c.isKey).name]);
    };

    const toggleAllRowsSelect = () => {
        selection.toggleAllRowsSelection();
    };
    return (
        <>
            <div>
                <button onClick={() => api.sortColumn('CustomerName')}>Sort by Customer Name</button>
                <button onClick={toggleFirstRowSelect}>Select first row</button>
                <button onClick={toggleAllRowsSelect}>Toggle all rows</button>
            </div>
            {state.isLoading && <div data-testid="loader">Loading</div>}
            <div>Selected rows: {selection.getSelectedCount()}</div>
            {selection.isIndeterminateSelection() && <div>Is indeterminate selection</div>}
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
            <section role="list">
                {selection.getSelectedRows().map((row) => (
                    <div key={row.OrderID} role="listitem">{row.OrderID}</div>
                ))}
            </section>
        </>
    );
};
