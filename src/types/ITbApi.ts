import { ColumnModel } from 'tubular-common';

export interface ITbApi {
    exportTo: (allRows: boolean, exportFunc: (payload: unknown[] | undefined, columns: ColumnModel[]) => void) => void;
    goToPage: (page: number) => void;
    processRequest: () => void;
    reloadGrid: (resetPage?: boolean) => void;
    setColumns: (columns: ColumnModel[]) => void;
    sortColumn: (columnName: string, multiSort?: boolean) => void;
    updateItemsPerPage: (itemsPerPage: number) => void;
    updateSearchText: (searchText: string) => void;
}
