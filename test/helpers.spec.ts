/**
 * @jest-environment jsdom
 */

import { getRemoteDataSource, getLocalDataSource, tbId } from '../src/helpers';
import { exportGrid, generateOnRowClickProxy } from '../src';
import { simpleRequest } from './mock';

describe('tbId', () => {
    it('Id should be tbComponent_n+1', () => {
        expect(tbId()).toBe('tbComponent_0');
        expect(tbId()).toBe('tbComponent_1');
    });
});

describe('getLocalDataSource', () => {
    it('Rejects', () => {
        expect(getLocalDataSource(null)(null)).rejects.not.toBeNull();
    });
});

describe('getRemoteDataSource', () => {
    it('Rejects', () => {
        expect(getRemoteDataSource(null)(null)).rejects.not.toBeNull();
    });
});

describe('generateOnRowClickProxy', () => {
    it('Should execute onRowClick function', () => {
        const row: Record<string, any> = ['key', null];
        const onRowClick = jest.fn();
        generateOnRowClickProxy(onRowClick(row));
        expect(onRowClick.mock.calls.length).toBe(1);
    });
});

describe('exportGrid', () => {
    it('Should simulate exportFile', () => {
        const mockCreateObjectURL = jest.fn();
        const mockRevokeObjectURL = jest.fn();

        URL.createObjectURL = mockCreateObjectURL;
        URL.revokeObjectURL = mockRevokeObjectURL;

        exportGrid('csv', [], simpleRequest.columns, 'Test');

        expect(mockCreateObjectURL.mock.calls.length).toBe(1);
        expect(mockRevokeObjectURL.mock.calls.length).toBe(1);
    });

    it('Should simulate exportFile with IE 10+', () => {
        const mockMsSaveBlob = jest.fn();
        navigator.msSaveBlob = mockMsSaveBlob;

        exportGrid('csv', [], simpleRequest.columns, 'Test');

        expect(mockMsSaveBlob.mock.calls.length).toBe(1);
    });

    it('Should simulate printDoc with title=Test', () => {
        const myMock = jest.fn();
        const mockWindow = { document: { write: jest.fn(), close: jest.fn() } };
        myMock.mockReturnValue(mockWindow);
        window.open = myMock;

        exportGrid('', [], simpleRequest.columns, 'Test');
        expect(myMock.mock.calls.length).toBe(1);
    });
});
