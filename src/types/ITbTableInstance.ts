import type { ITbApi } from './ITbApi';
import type { ITbState } from './ITbState';

export interface ITbTableInstance {
    api: ITbApi & {
        sortColumn: (columnName: string) => void;
    };

    state: ITbState;
}
