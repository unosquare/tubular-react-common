export interface ITbSelection {
    rowSelection: any;
    toggleRowSelection: (id: string) => void;
    toggleAllRowsSelection: () => void;
    getSelectedCount: () => number;
    getUnSelectedCount: () => number;
    isIndeterminateSelection: () => boolean;
    getSelectedRows: () => any[];
}
