import {
    getCsv,
    getHtml,
    ColumnModel,
    GridRequest,
    GridResponse,
    TubularHttpClientAbstract,
    parsePayload,
    TubularHttpClient,
    Transformer,
} from 'tubular-common';

let id = 0;

export const tbId = (): string => `tbComponent_${id++}`;

export const getLocalDataSource = (source: any[]) => (request: GridRequest): Promise<GridResponse> => {
    return new Promise((resolve, reject) => {
        try {
            resolve(Transformer.getResponse(request, source));
        } catch (error) {
            reject(error);
        }
    });
};

export const getRemoteDataSource = (request: string | Request | TubularHttpClientAbstract) => async (
    gridRequest: GridRequest,
): Promise<GridResponse> => {
    const httpCast = request as TubularHttpClientAbstract;
    const httpClient: TubularHttpClientAbstract = httpCast.request ? httpCast : new TubularHttpClient(request);

    const data: GridResponse = await httpClient.fetch(gridRequest);

    if (!TubularHttpClient.isValidResponse(data as any)) {
        throw new Error('Server response is a invalid Tubular object');
    }

    TubularHttpClient.fixResponse(data);

    data.payload = data.payload.map((row: Record<string, any>) => parsePayload(row, gridRequest.columns));

    return data;
};

export const generateOnRowClickProxy = (onRowClick: (row: Record<string, any>) => void) => {
    return (row: Record<string, any>) => (): void => {
        if (onRowClick) {
            onRowClick(row);
        }
    };
};

function printDoc(gridResult: [], columns: ColumnModel[], gridName: string): void {
    const tableHtml = getHtml(gridResult, columns);

    const documentToPrint = window.open('about:blank', 'Print', 'location=0,height=500,width=800');
    documentToPrint.document.write(
        '<link rel="stylesheet" href="//cdn.jsdelivr.net/bootstrap/latest/css/bootstrap.min.css" />',
    );
    documentToPrint.document.title = gridName;
    documentToPrint.document.write('<body onload="window.print();">');
    documentToPrint.document.write(`<h1>${gridName}</h1>`);
    documentToPrint.document.write(tableHtml);
    documentToPrint.document.write('</body>');
    documentToPrint.document.close();
}

function exportFile(gridResult: [], columns: ColumnModel[], gridName: string): void {
    const csvFile = getCsv(gridResult, columns);

    const blob = new Blob(['\uFEFF' + csvFile], {
        type: 'text/csv;charset=utf-8;',
    });

    let fileName = 'data.csv'
    if (gridName) {
        fileName = `${gridName.replace(/\\|\//g, '')}.csv`; 
    }
    
    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, fileName);
    } else {
        const fileURL = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', fileURL);
        downloadLink.setAttribute('id', 'download');
        downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        URL.revokeObjectURL(fileURL);
    }
}

export const exportGrid = (media: string, gridResult: [], columns: ColumnModel[], gridName: string = ''): void => {
    if (media === 'csv') {
        exportFile(gridResult, columns, gridName);
    } else {
        printDoc(gridResult, columns, gridName);
    }
};
