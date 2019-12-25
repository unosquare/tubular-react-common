import { ColumnModel, FilterWrapper } from 'tubular-common';

export interface ITbApi {
    exportTo: (allRows: boolean, exportFunc: (payload: any[], columns: ColumnModel[]) => void) => void;
    goToPage: (page: number) => void;
    handleFilterChange: (value: FilterWrapper) => void;
    processRequest: () => void;
    setActiveColumn: (column: ColumnModel) => void;
    setFilter: (value: FilterWrapper) => void;
    sortColumn: (columnName: string, multiSort?: boolean) => void;
    updateItemPerPage: (itemsPerPage: number) => void;
    updateSearchText: (searchText: string) => void;
}
