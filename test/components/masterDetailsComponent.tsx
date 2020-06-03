import * as React from 'react';
import { useMasterDetails } from '../../src/useMasterDetails';

export const MasterDetailsComponent = () => {
    const [open, openDetails] = useMasterDetails();
    return (
        <div>
            <span data-testid='openValue'>{ open ? 'Open' : 'Closed'}</span>
            <button onClick={openDetails}>Open/Close</button>
        </div>
    );
};