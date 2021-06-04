/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { render, fireEvent, getByText, getByTestId } from '@testing-library/react';
import { MasterDetailsComponent } from './components/masterDetailsComponent';

describe('useMasterDetails', () => {
    it('should render initial state w/o problem and closed', async () => {
        const { container } = render(<MasterDetailsComponent />);
        expect(getByTestId(container, 'openValue').innerHTML).toBe('Closed');
    });

    it('should be open', async () => {
        const { container } = render(<MasterDetailsComponent />);
        const openBtn = getByText(container, 'Open/Close');
        fireEvent.click(openBtn);
        expect(getByTestId(container, 'openValue').innerHTML).toBe('Open');
    });
});
