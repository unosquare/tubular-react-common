import type { ColumnModel } from 'tubular-common';
import type { ITbSelection } from './ITbSelection';

export interface ITbRowProps {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    row: any;
    rowIndex: number;
    columns: ColumnModel[];
    onRowClick?(): void;
    rowSelectionEnabled?: boolean;
    selection?: ITbSelection;
}
