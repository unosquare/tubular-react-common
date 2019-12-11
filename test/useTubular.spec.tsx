import '@testing-library/jest-dom/extend-expect';
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import * as React from 'react';
import { render, waitForDomChange } from '@testing-library/react';
import { TubularComponent } from './components/tubularComponent';

describe('useTubular', () => {
    it('should render initial state w/o problem', async () => {
        const orderId = 'Id';
        const { queryByText, queryAllByText } = render(<TubularComponent />);

        expect(queryByText(orderId)).toBeDefined();
        expect(queryByText('OXXO')).toBeNull();

        await waitForDomChange();
        const oxxoRows = queryAllByText('OXXO');
        expect(oxxoRows).toHaveLength(2);
    });
});