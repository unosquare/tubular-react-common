import '@testing-library/jest-dom/extend-expect';
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import * as React from 'react';
import { render, fireEvent, getByText, getByTestId } from '@testing-library/react';
import { GridRefreshComponent } from './components/GridRefreshComponent';

describe('useGridRefresh', () => {
    it('should render initial state w/o problem and refresh value 0', async () => {
        const { container } = render(<GridRefreshComponent />);
        expect(getByTestId(container, 'refreshValue').innerHTML).toBe('0');
    });

    it('should increase refresh value to 1', async () => {
        const { container, debug } = render(<GridRefreshComponent />);
        const refreshBtn = getByText(container, 'Refresh');
        fireEvent.click(refreshBtn);
        debug();
        expect(getByTestId(container, 'refreshValue').innerHTML).toBe('1');
    });
});