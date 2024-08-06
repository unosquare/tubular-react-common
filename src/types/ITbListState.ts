import { ITbState } from './ITbState';

export interface ITbListInternalState {
    hasNextPage: boolean;
    items: unknown[];
}

export interface ITbListState extends ITbState {
    infiniteLoaderRef: React.RefObject<{ resetLoadMoreRowsCache: (x: boolean) => void }>;
    list: ITbListInternalState;
}
