import { ColumnModel, DataGridStorage } from 'tubular-common';

export interface ITbState {
    aggregate: Record<string, number> | undefined;
    columns: ColumnModel[];
    data: unknown[] | undefined;
    error: unknown;
    filteredRecordCount: number;
    initialized: boolean;
    isLoading: boolean;
    itemsPerPage: number;
    page: number;
    searchText: string | null;
    storage: DataGridStorage | null;
    totalRecordCount: number;
}
