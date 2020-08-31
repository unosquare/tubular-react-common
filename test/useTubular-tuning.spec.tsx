import * as React from 'react';
import { render, getAllByRole, RenderResult, fireEvent, waitFor, getByRole } from '@testing-library/react';
import { TubularComponent } from './components/tubularComponent';

import * as helpers from '../src/helpers';

describe('useTubular', () => {
    let sut: RenderResult;
    let getLocalDataSourceSpy: any;
    beforeEach(async () => {
        jest.resetAllMocks();
        getLocalDataSourceSpy = jest.spyOn(helpers, 'getLocalDataSource');
        sut = render(<TubularComponent />);
        await waitFor(() => expect(getByRole(sut.container, 'table')).toBeDefined());
    });

    it('should render initial state w/o problem', () => {
        expect(getLocalDataSourceSpy).toHaveBeenCalledTimes(1);
        expect(sut).not.toBeNull();
    });
});
