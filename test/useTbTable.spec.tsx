import * as React from 'react';
import { render, fireEvent, getByText, waitFor, getByRole, getAllByRole } from '@testing-library/react';
import { TbTableComponent } from './components/tbTableComponent';

const getRowBoundaries = (rows: any[]) => {
    const lastRowCells = getAllByRole(rows[9], 'cell');
    const firstRowCells = getAllByRole(rows[0], 'cell');

    return {
        first: firstRowCells,
        last: lastRowCells,
    };
};

describe('TbTableComponent', ()=> {
    it('should render initial state w/o problem', async () => {
        const { getByRole } = render(<TbTableComponent />);
        const table = getByRole('table');
        expect(table).toBeDefined();
    });

    it('Should change setMultiSort value when pressing keyDown and keyUp', async () => {
        const { container } = render(<TbTableComponent />);

        fireEvent.keyDown(container, { key: 'Control', code: 'Control' });
        fireEvent.keyUp(container, { key: 'Control', code: 'Control' });

        expect(container).toBeDefined();
    });

    it('Pressing a key different to Control', async () => {
        const { container } = render(<TbTableComponent />);

        fireEvent.keyDown(container, { key: 'Enter', code: 'Enter' });
        fireEvent.keyUp(container, { key: 'Enter', code: 'Enter' });

        expect(container).toBeDefined();
    });

    it('Should sort a column', async () => {
        let sut = render(<TbTableComponent />);
        const sortBtn = sut.getByText('Sort by Customer Name');

        fireEvent.click(sortBtn);
        const table = getByRole(sut.container, 'table');
        await waitFor(()=> expect(table).toBeDefined());

        const rows = sut.queryAllByRole('row');
        const rowsBoundaries = getRowBoundaries(rows);

        expect(rowsBoundaries.first[0]).toHaveTextContent('1');
        expect(rowsBoundaries.first[1]).toHaveTextContent('Microsoft');
    });
});