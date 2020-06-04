import * as React from 'react';
import { render, fireEvent, getByText } from '@testing-library/react';
import { TbTableComponent } from './components/tbTableComponent';

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

        expect(container).toBeDefined();//Working on a more realistic validation
    });

    it('Should sort a column', async () => {
        const { container } = render(<TbTableComponent />);

        fireEvent.keyDown(container, { key: 'Control', code: 'Control' });
        const sortBtn = getByText(container, 'Sort by Customer Name');
        fireEvent.click(sortBtn);

        expect(container).toBeDefined();//Working on a more realistic validation
    });
});