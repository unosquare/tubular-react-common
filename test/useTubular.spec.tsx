import '@testing-library/jest-dom/extend-expect';
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import * as React from 'react';
import { render, waitForDomChange, getAllByRole, RenderResult, fireEvent } from '@testing-library/react';
import { TubularComponent } from './components/tubularComponent';

const getRowBoundaries = (rows: any[]) => {
    const lastRowCells = getAllByRole(rows[9], 'cell');
    const firstRowCells = getAllByRole(rows[0], 'cell');

    return {
        first: firstRowCells,
        last: lastRowCells,
    };
};

const expectFirstPage = (rows: any[]) => {
    const rowsBoundaries = getRowBoundaries(rows);

    expect(rowsBoundaries.first[0]).toHaveTextContent('1');
    expect(rowsBoundaries.first[1]).toHaveTextContent('Microsoft');

    expect(rowsBoundaries.last[0]).toHaveTextContent('10');
    expect(rowsBoundaries.last[1]).toHaveTextContent('Vesta');
};

describe('useTubular', () => {
    it('should render initial state w/o problem', async () => {
        const { getByRole } = render(<TubularComponent />);
        const table = getByRole('table');
        expect(table).toBeDefined();
    });

    describe('Pagination', () => {
        let sut: RenderResult;
        beforeEach(async () => {
            sut = render(<TubularComponent />);
            await waitForDomChange();
        });

        it('should show first page by default', async () => {
            const rows = sut.queryAllByRole('row');
            expect(rows).toHaveLength(10);

            expectFirstPage(rows);
        });

        describe('Changing page', () => {
            it('should go to page 2', async () => {
                const nextPageBtn = sut.getByText('Go to next page');

                fireEvent.click(nextPageBtn);
                await waitForDomChange();

                const rows = sut.queryAllByRole('row');
                const rowsBoundaries = getRowBoundaries(rows);

                expect(rowsBoundaries.first[0]).toHaveTextContent('11');
                expect(rowsBoundaries.first[1]).toHaveTextContent('Microsoft');

                expect(rowsBoundaries.last[0]).toHaveTextContent('20');
                expect(rowsBoundaries.last[1]).toHaveTextContent('OXXO');
            });

            it('should go to page 1', async () => {
                const prevPageBtn = sut.getByText('Go to previous page');

                fireEvent.click(prevPageBtn);
                await waitForDomChange();

                const rows = sut.queryAllByRole('row');
                expectFirstPage(rows);
            });
        });
    });

    describe('Sorting', () => {
        let sut: RenderResult;
        beforeEach(async () => {
            sut = render(<TubularComponent />);
            await waitForDomChange();
        });

        it('should show first page by default', async () => {
            const rows = sut.queryAllByRole('row');
            expect(rows).toHaveLength(10);

            expectFirstPage(rows);
        });

        describe('Sorting Asc & Desc', () => {
            it('should sort by CustomerName ASC', async () => {
                const sortBtn = sut.getByText('Sort by Customer Name');

                fireEvent.click(sortBtn);
                await waitForDomChange();

                const rows = sut.queryAllByRole('row');
                const rowsBoundaries = getRowBoundaries(rows);

                expect(rowsBoundaries.first[0]).toHaveTextContent('1');
                expect(rowsBoundaries.first[1]).toHaveTextContent('Microsoft');

                expect(rowsBoundaries.last[0]).toHaveTextContent('5');
                expect(rowsBoundaries.last[1]).toHaveTextContent('Super La Playa');
            });

            it('should sort by CustomerName DESC', async () => {
                const sortBtn = sut.getByText('Sort by Customer Name');
                fireEvent.click(sortBtn);
                await waitForDomChange();

                const rows = sut.queryAllByRole('row');
                const rowsBoundaries = getRowBoundaries(rows);

                expect(rowsBoundaries.first[0]).toHaveTextContent('21');
                expect(rowsBoundaries.first[1]).toHaveTextContent('Wizeline');

                expect(rowsBoundaries.last[0]).toHaveTextContent('5');
                expect(rowsBoundaries.last[1]).toHaveTextContent('Super La Playa');
            });
        });
    });
});
