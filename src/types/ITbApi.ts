import { ColumnModel, CompareOperators } from 'tubular-common';

export interface ITbApi {
    exportTo: (allRows: boolean, exportFunc: (payload: any[], columns: ColumnModel[]) => void) => void;
    goToPage: (page: number) => void;
    handleFilterChange: (filterText: string, filterOperator: CompareOperators, filterArgument?: any[]) => void;
    processRequest: () => void;
    setActiveColumn: (column: ColumnModel) => void;
    setColumns: (columns: ColumnModel[]) => void;
    setFilter: (filterText: string, filterOperator: CompareOperators, filterArgument?: any[]) => void;
    sortColumn: (columnName: string, multiSort?: boolean) => void;
    updateItemsPerPage: (itemsPerPage: number) => void;
    updateSearchText: (searchText: string) => void;
}
