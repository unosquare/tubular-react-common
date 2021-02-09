import { ColumnModel, DataGridStorage, TubularHttpClientAbstract } from 'tubular-common';
import { ITbRowProps } from './ITbRowProps';

export interface ITbGridProps {
    columns: ColumnModel[];
    dataSource: any[] | string | Request | TubularHttpClientAbstract;
    gridName: string;
    storage?: DataGridStorage;
    rowSelectionEnabled?: boolean;

    // Overrides
    rowComponent?: React.FunctionComponent<ITbRowProps>;
    footerComponent?: React.FunctionComponent<any>;

    // Events
    onError?(err: string): void;
    onRowClick?(row: any): void;
}
