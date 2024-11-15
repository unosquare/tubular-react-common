import type { ColumnModel, DataGridStorage, TubularHttpClientAbstract } from 'tubular-common';
import type { ITbRowProps } from './ITbRowProps';

export interface ITbGridProps {
    columns: ColumnModel[];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    dataSource: any[] | string | Request | TubularHttpClientAbstract;
    gridName: string;
    storage?: DataGridStorage;
    rowSelectionEnabled?: boolean;

    // Overrides
    rowComponent?: React.FunctionComponent<ITbRowProps>;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    footerComponent?: React.FunctionComponent<any>;

    // Events
    onError?(err: string): void;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    onRowClick?(row: any): void;
}
