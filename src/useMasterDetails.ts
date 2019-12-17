import * as React from 'react';

export const useMasterDetails = (): [boolean, () => void] => {
    const [open, openDetails] = React.useState(false);

    return [
        open,
        () => {
            openDetails(!open);
        },
    ];
};
