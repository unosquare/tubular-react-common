import type { ITbApi } from './ITbApi';
import type { ITbState } from './ITbState';

export interface ITbInstance {
    api: ITbApi;
    state: ITbState;
}
