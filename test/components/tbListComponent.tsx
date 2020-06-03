import * as React from 'react';
import { useTbList } from '../../src/useTbList';
import columns from '../fixtures/columns';
import localData from '../fixtures/localData';

export const TbListComponent = () => {
    const { state, api } = useTbList(columns, localData);
    return (
        <>
        </>
    );
};