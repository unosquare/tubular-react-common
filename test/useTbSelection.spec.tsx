/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { TbTableComponent } from './components/tbTableComponent';

describe('useTbSelection', () => {
    it('should select first row', async () => {
        render(<TbTableComponent />);
        await waitFor(() => expect(screen.queryByTestId("loader")).not.toBeInTheDocument());

        const selectFirstRowBtn = screen.getByText(/Select first row/);
        fireEvent.click(selectFirstRowBtn);

        expect(screen.queryByText(/Selected rows: 1/)).toBeInTheDocument();
    });

    it('should select and unselect first row', async () => {
        render(<TbTableComponent />);
        await waitFor(() => expect(screen.queryByTestId("loader")).not.toBeInTheDocument());

        const selectFirstRowBtn = screen.getByText(/Select first row/);
        fireEvent.click(selectFirstRowBtn);
        expect(screen.queryByText(/Selected rows: 1/)).toBeInTheDocument();

        fireEvent.click(selectFirstRowBtn);
        expect(screen.queryByText(/Selected rows: 0/)).toBeInTheDocument();
    });

    it('should select all rows', async () => {
        render(<TbTableComponent />);
        await waitFor(() => expect(screen.queryByTestId("loader")).not.toBeInTheDocument());

        const selectAllRows = screen.getByText(/Toggle all rows/);
        fireEvent.click(selectAllRows);
        expect(screen.queryByText(/Selected rows: 10/)).toBeInTheDocument();

        const selectedIds = screen.queryAllByRole("listitem");
        expect(selectedIds).toHaveLength(10);

        fireEvent.click(selectAllRows);
        expect(screen.queryByText(/Selected rows: 0/)).toBeInTheDocument();

        
    });
});
