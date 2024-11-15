/**
 * @jest-environment jsdom
 */

import { fireEvent, getAllByRole, getByRole, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { TbTableComponent } from './components/tbTableComponent';

const getRowBoundaries = (rows: any[]) => {
    const lastRowCells = getAllByRole(rows[9], 'cell');
    const firstRowCells = getAllByRole(rows[0], 'cell');

    return {
        first: firstRowCells,
        last: lastRowCells,
    };
};

describe('useTbTable', () => {
    it('should render initial state w/o problem', async () => {
        const { getByRole } = render(<TbTableComponent />);
        await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
        const table = getByRole('table');
        expect(table).toBeDefined();
    });

    it('Should change setMultiSort value when pressing keyDown and keyUp', async () => {
        const { container } = render(<TbTableComponent />);

        fireEvent.keyDown(container, { key: 'Control', code: 'Control' });
        fireEvent.keyUp(container, { key: 'Control', code: 'Control' });

        await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
        expect(container).toBeDefined();
    });

    it('Pressing a key different to Control to avoid a succes execution of keyDown and keyUp', async () => {
        const { container } = render(<TbTableComponent />);

        fireEvent.keyDown(container, { key: 'Enter', code: 'Enter' });
        fireEvent.keyUp(container, { key: 'Enter', code: 'Enter' });

        await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
        expect(container).toBeDefined();
    });

    it('Should sort a column', async () => {
        const sut = render(<TbTableComponent />);
        const sortBtn = sut.getByText('Sort by Customer Name');

        fireEvent.click(sortBtn);
        await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
        const table = getByRole(sut.container, 'table');

        const rows = sut.queryAllByRole('row');
        const rowsBoundaries = getRowBoundaries(rows);

        expect(rowsBoundaries.first[0]).toHaveTextContent('1');
        expect(rowsBoundaries.first[1]).toHaveTextContent('Microsoft');
    });
});
