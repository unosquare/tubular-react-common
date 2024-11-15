import type { ITbListApi } from './ITbListApi';
import type { ITbListState } from './ITbListState';

export interface ITbListInstance {
    state: ITbListState;
    api: ITbListApi;
}
