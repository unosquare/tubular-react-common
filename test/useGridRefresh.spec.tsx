/**
 * @jest-environment jsdom
 */

import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import * as React from 'react';
import { GridRefreshComponent } from './components/gridRefreshComponent';

describe('useGridRefresh', () => {
    it('should render initial state w/o problem and refresh value 0', async () => {
        const { container } = render(<GridRefreshComponent />);
        expect(getByTestId(container, 'refreshValue').innerHTML).toBe('0');
    });

    it('should increase refresh value to 1', async () => {
        const { container } = render(<GridRefreshComponent />);
        const refreshBtn = getByText(container, 'Refresh');
        fireEvent.click(refreshBtn);
        expect(getByTestId(container, 'refreshValue').innerHTML).toBe('1');
    });
});
