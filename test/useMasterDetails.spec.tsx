import * as React from 'react';
import { render, fireEvent, getByText, getByTestId } from '@testing-library/react';
import { MasterDetailsComponent } from './components/masterDetailsComponent';

describe('useGridRefresh', () => {
    it('should render initial state w/o problem and refresh value 0', async () => {
        const { container } = render(<MasterDetailsComponent />);
        expect(getByTestId(container, 'openValue').innerHTML).toBe('Closed');
    });

    it('should increase refresh value to 1', async () => {
        const { container } = render(<MasterDetailsComponent />);
        const openBtn = getByText(container, 'Open/Close');
        fireEvent.click(openBtn);
        expect(getByTestId(container, 'openValue').innerHTML).toBe('Open');
    });
});