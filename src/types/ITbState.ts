import { ColumnModel, DataGridStorage } from 'tubular-common';

export interface ITbState {
    activeColumn: ColumnModel;
    aggregate: {};
    columns: ColumnModel[];
    data: any[];
    error: any;
    filteredRecordCount: number;
    initialized: boolean;
    isLoading: boolean;
    itemsPerPage: number;
    page: number;
    searchText: string;
    storage: DataGridStorage;
    totalRecordCount: number;
}
