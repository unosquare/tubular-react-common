import type { DataGridStorage } from 'tubular-common';
import type { ITbCallbacks } from './ITbCallbacks';
import type { ITbPagination } from './ITbPagination';

export interface ITbOptions {
    componentName?: string;
    deps?: unknown[] | null;
    pagination?: Partial<ITbPagination>;
    callbacks?: ITbCallbacks;
    storage?: DataGridStorage;
    searchText?: string;
}
