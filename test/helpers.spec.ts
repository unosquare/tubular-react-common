import { exportGrid, getLocalDataSource, tbId } from '../src/helpers';
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


    it('Should simulate printDoc', ()=>{
        const myMock = jest.fn();
        const mockWindow = { document: { write: jest.fn(), close: jest.fn()}};
        myMock.mockReturnValue(mockWindow);
        window.open = myMock;

        expect(exportGrid('', [], simpleRequest.columns, 'Test')).toBeUndefined();
    });
});