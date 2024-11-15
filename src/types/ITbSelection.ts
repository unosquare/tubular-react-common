export interface ITbSelection {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    rowSelection: any;
    toggleRowSelection: (id: string) => void;
    toggleAllRowsSelection: () => void;
    getSelectedCount: () => number;
    getUnSelectedCount: () => number;
    isIndeterminateSelection: () => boolean;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    getSelectedRows: () => any[];
}
