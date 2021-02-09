import { ColumnModel } from 'tubular-common';
import { ITbSelection } from './ITbSelection';

export interface ITbRowProps {
    row: any;
    rowIndex: number;
    columns: ColumnModel[];
    onRowClick?(): void;
    rowSelectionEnabled?: boolean;
    selection?: ITbSelection;
}
