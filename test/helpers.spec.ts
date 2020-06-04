import { exportGrid, getLocalDataSource } from '../src/helpers';
import { simpleRequest } from './mock';

describe('getLocalDataSource', ()=> {
    it('Rejects', ()=>{
        expect(getLocalDataSource(null)(null)).rejects.not.toBeNull();
    });
});

describe('exportGrid', ()=> {
    it('init', ()=>{
        window.open = jest.fn();

        expect(exportGrid('', [], simpleRequest.columns, '')).toThrowError();
    });
});