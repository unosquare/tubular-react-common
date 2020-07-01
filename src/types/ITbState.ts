import { ColumnModel, DataGridStorage } from 'tubular-common';

export interface ITbState {
    aggregate: Record<string, number>;
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
