import * as React from 'react';
import { useTubular } from '../../src/useTubular';
import columns from '../fixtures/columns';
import localData from '../fixtures/localData';

export const TubularComponent = () => {
    const { state, api } = useTubular(columns, localData);
    return (
        <table>
            <thead>
                <tr>
                    {state.columns
                        .filter(col => col.Visible)
                        .map(col => {
                            return <th key={col.Name}>{col.Label}</th>;
                        })}
                </tr>
            </thead>
            <tbody>
                {state.data.map((row, index) => {
                    return (
                        <tr key={index}>
                            {state.columns
                                .filter(col => col.Visible)
                                .map(col => {
                                    return <td key={col.Name}>{row[col.Name]}</td>;
                                })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
