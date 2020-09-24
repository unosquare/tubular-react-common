import * as React from 'react';
import {
    render,
    getAllByRole,
    RenderResult,
    fireEvent,
    waitFor,
    getByRole,
    queryAllByRole,
    queryByRole,
} from '@testing-library/react';
import { TubularComponent } from './components/tubularComponent';

import * as helpers from '../src/helpers';

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
    const getLocalDataSourceSpy: jest.SpyInstance = jest.spyOn(helpers, 'getLocalDataSource');

    describe('Pagination', () => {
        let sut: RenderResult;
        beforeEach(async () => {
            sut = render(<TubularComponent />);
            await waitFor(() => expect(getByRole(sut.container, 'table')).toBeDefined());
        });

        afterEach(() => {
            getLocalDataSourceSpy.mockClear();
        });

        it('should show first page by default', async () => {
            const rows = sut.queryAllByRole('row');
            expect(rows).toHaveLength(10);

            expect(getLocalDataSourceSpy).toHaveBeenCalledTimes(1);
            expectFirstPage(rows);
        });

        describe('Changing page', () => {
            it('should go to page 2', async () => {
                const nextPageBtn = sut.getByText('Go to next page');

                fireEvent.click(nextPageBtn);

                await waitFor(() => expect(queryByRole(sut.container, 'table')).toBeInTheDocument());

                const rows = sut.queryAllByRole('row');
                const rowsBoundaries = getRowBoundaries(rows);

                expect(rowsBoundaries.first[0]).toHaveTextContent('11');
                expect(rowsBoundaries.first[1]).toHaveTextContent('Microsoft');

                expect(rowsBoundaries.last[0]).toHaveTextContent('20');
                expect(rowsBoundaries.last[1]).toHaveTextContent('OXXO');

                expect(getLocalDataSourceSpy).toHaveBeenCalledTimes(2);
            });

            it('should go to page 1', async () => {
                const nextPageBtn = sut.getByText('Go to next page');
                fireEvent.click(nextPageBtn);

                await waitFor(() => expect(queryByRole(sut.container, 'table')).toBeInTheDocument());

                const prevPageBtn = sut.getByText('Go to previous page');
                fireEvent.click(prevPageBtn);

                await waitFor(() => expect(queryByRole(sut.container, 'table')).toBeInTheDocument());
                await waitFor(() => expect(queryAllByRole(sut.container, 'row')).toHaveLength(10));

                const rows = sut.queryAllByRole('row');
                expectFirstPage(rows);
                expect(getLocalDataSourceSpy).toHaveBeenCalledTimes(3);
            });
        });
    });
});

describe('Sorting', () => {
    const getLocalDataSourceSpy: jest.SpyInstance = jest.spyOn(helpers, 'getLocalDataSource');
    let sut: RenderResult;
    beforeEach(async () => {
        sut = render(<TubularComponent />);
        await waitFor(() => expect(queryByRole(sut.container, 'table')).toBeInTheDocument());
    });

    afterEach(() => {
        getLocalDataSourceSpy.mockClear();
    });

    it('should show first page by default', async () => {
        const rows = sut.queryAllByRole('row');
        expect(rows).toHaveLength(10);

        expectFirstPage(rows);
        expect(getLocalDataSourceSpy).toHaveBeenCalledTimes(1);
    });

    it('should reload the grid', async () => {
        const refreshBtn = sut.getByText('Refresh');

        fireEvent.click(refreshBtn);
        await waitFor(() => expect(queryByRole(sut.container, 'table')).toBeDefined());

        const rows = sut.queryAllByRole('row');
        expect(rows).toHaveLength(10);

        expectFirstPage(rows);
        expect(getLocalDataSourceSpy).toHaveBeenCalledTimes(2);
    });

    describe('Sorting Asc & Desc', () => {
        it('should sort by CustomerName ASC', async () => {
            const sortBtn = sut.getByText('Sort by Customer Name');

            fireEvent.click(sortBtn);
            await waitFor(() => expect(queryByRole(sut.container, 'table')).toBeDefined());

            const rows = sut.queryAllByRole('row');
            const rowsBoundaries = getRowBoundaries(rows);

            expect(rowsBoundaries.first[0]).toHaveTextContent('1');
            expect(rowsBoundaries.first[1]).toHaveTextContent('Microsoft');

            expect(rowsBoundaries.last[0]).toHaveTextContent('5');
            expect(rowsBoundaries.last[1]).toHaveTextContent('Super La Playa');

            expect(getLocalDataSourceSpy).toHaveBeenCalledTimes(2);
        });

        xit('should sort by CustomerName DESC', async () => {
            const sortBtn = sut.getByText('Sort by Customer Name');
            fireEvent.click(sortBtn);
            const table = getByRole(sut.container, 'table');
            await waitFor(() => expect(table).toBeDefined());

            const rows = sut.queryAllByRole('row');
            const rowsBoundaries = getRowBoundaries(rows);

            expect(rowsBoundaries.first[0]).toHaveTextContent('21');
            expect(rowsBoundaries.first[1]).toHaveTextContent('Wizeline');

            expect(rowsBoundaries.last[0]).toHaveTextContent('5');
            expect(rowsBoundaries.last[1]).toHaveTextContent('Super La Playa');
        });
    });
});
