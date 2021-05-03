import * as React from 'react';
import { ColumnModel } from 'tubular-common';
import { ITbTableInstance } from './types';
import { ITbSelection } from './types/ITbSelection';

const createRowSelectionFromData = (data: any[], columns: ColumnModel[]) => {
    const keyColumn = columns.find((c) => c.isKey).name;
    const newSelection: any = {};
    data.forEach((row: any) => {
        if (newSelection[row[keyColumn]] === undefined) {
            newSelection[row[keyColumn]] = false;
        }
    });

    return newSelection;
};

const useTbSelection = (tbInstance: ITbTableInstance, rowSelectionEnabled: boolean): ITbSelection => {
    const [rowSelection, setRowSelection] = React.useState({} as any);
    const keyColumn = tbInstance.state.columns.find((c) => c.isKey);
    const toggleRowSelection = (id: string) => setRowSelection({ ...rowSelection, [id]: !rowSelection[id] });
    const getSelectedCount = () => Object.keys(rowSelection).filter((k) => rowSelection[k]).length;
    const getUnSelectedCount = () => Object.keys(rowSelection).filter((k) => !rowSelection[k]).length;
    const getSelectedRows = () => {
        const selectedKeys = Object.keys(rowSelection).filter((k) => rowSelection[k]);
        return tbInstance.state.data.filter((row) => selectedKeys.includes(`${row[keyColumn.name]}`));
    };

    const isIndeterminateSelection = () =>
        Object.keys(rowSelection).length > 0 && getSelectedCount() > 0 && getUnSelectedCount() > 0;

    const toggleAllRowsSelection = () => {
        const newRowSelection = createRowSelectionFromData(tbInstance.state.data, tbInstance.state.columns);
        const unSelectedCount = Object.keys(rowSelection).filter((k) => !rowSelection[k]).length;
        const update = unSelectedCount !== 0;
        Object.keys(rowSelection).forEach((f) => {
            newRowSelection[f] = update;
        });
        setRowSelection(newRowSelection);
    };

    React.useEffect(() => {
        if (rowSelectionEnabled) {
            const newSelection = createRowSelectionFromData(tbInstance.state.data, tbInstance.state.columns);
            setRowSelection(newSelection);
        }
    }, [rowSelectionEnabled, tbInstance.state.data, tbInstance.state.columns]);

    return {
        rowSelection,
        toggleRowSelection,
        toggleAllRowsSelection,
        getSelectedCount,
        getSelectedRows,
        getUnSelectedCount,
        isIndeterminateSelection,
    };
};

export default useTbSelection;
