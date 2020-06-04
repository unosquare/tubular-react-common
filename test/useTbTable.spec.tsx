import * as React from 'react';
import { render } from '@testing-library/react';
import { TbTableComponent } from './components/tbTableComponent';

describe('TbTableComponent', ()=> {
    it('should render initial state w/o problem', async () => {
        const { getByRole } = render(<TbTableComponent />);
        const table = getByRole('table');
        expect(table).toBeDefined();
    });
});