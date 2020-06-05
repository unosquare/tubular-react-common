import { exportGrid, getRemoteDataSource, getLocalDataSource, tbId } from '../src/helpers';
import { simpleRequest } from './mock';

describe('tbId', ()=> {
    it('Id should be tbComponent_n+1', ()=>{
        expect(tbId()).toBe('tbComponent_0');
        expect(tbId()).toBe('tbComponent_1');
    });
});

describe('getLocalDataSource', ()=> {
    it('Rejects', ()=>{
        expect(getLocalDataSource(null)(null)).rejects.not.toBeNull();
    });
});

describe('getRemoteDataSource', ()=> {
    it('Rejects', ()=>{
        expect(getRemoteDataSource(null)(null)).rejects.not.toBeNull();
    });
});

describe('exportGrid', ()=> {
    it('Should simulate exportFile', ()=>{
        URL.createObjectURL = jest.fn();
        URL.revokeObjectURL = jest.fn();

        expect(exportGrid('csv', [], simpleRequest.columns, 'Test')).toBeUndefined();
    });

    it('Should simulate exportFile with IE 10+', ()=>{
        navigator.msSaveBlob = jest.fn();
        expect(exportGrid('csv', [], simpleRequest.columns, 'Test')).toBeUndefined();
    });

    it('Should simulate printDoc with title=Test', ()=>{
        const myMock = jest.fn();
        const mockWindow = { document: { write: jest.fn(), close: jest.fn()}};
        myMock.mockReturnValue(mockWindow);
        window.open = myMock;
        exportGrid('', [], simpleRequest.columns, 'Test');
        expect(mockWindow.document['title']).toBe('Test');
    });
});