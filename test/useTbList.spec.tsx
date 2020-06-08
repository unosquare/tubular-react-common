import * as React from 'react';
import { render, getAllByRole, RenderResult, fireEvent, waitFor, getByRole } from '@testing-library/react';
import { TbListComponent } from './components/tbListComponent';

const getRowBoundaries = (rows: any[]) => {
    const lastRowCells = getAllByRole(rows[9], 'cell');
    const firstRowCells = getAllByRole(rows[0], 'cell');

    return {
        first: firstRowCells,
        last: lastRowCells,
    };
};

describe('tbListComponent', () => {
    
    it('should render initial state w/o problem', async () => {
        const { getByRole } = render(<TbListComponent />);
        const table = getByRole('table');
        expect(table).toBeDefined();
    });

    describe('Changing page', () => {
        let sut: RenderResult;
        beforeEach(async () => {
            sut = render(<TbListComponent />);
            const table = getByRole(sut.container, 'table');
            await waitFor(()=> expect(table).toBeDefined());
        });

        it('should go to page 2', async () => {
            const nextPageBtn = sut.getByText('Go to page 2');

            fireEvent.click(nextPageBtn);
            const table = getByRole(sut.container, 'table');
            await waitFor(()=> expect(table).toBeDefined());

            const rows = sut.queryAllByRole('row');
            const rowsBoundaries = getRowBoundaries(rows);

            expect(rowsBoundaries.first[0]).toHaveTextContent('11');
            expect(rowsBoundaries.first[1]).toHaveTextContent('Microsoft');

            expect(rowsBoundaries.last[0]).toHaveTextContent('20');
            expect(rowsBoundaries.last[1]).toHaveTextContent('OXXO');
        });
    });
});