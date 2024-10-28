import {
    ColumnModel,
    getCsv,
    getHtml,
    GridRequest,
    GridResponse,
    parsePayload,
    Transformer,
    TubularHttpClient,
    TubularHttpClientAbstract,
} from 'tubular-common';
import striptags from 'striptags';

let id = 0;

export const tbId = () => `tbComponent_${id++}`;

export const getLocalDataSource =
    (source: unknown[]) =>
    (request: GridRequest): Promise<GridResponse> =>
        new Promise((resolve, reject) => {
            try {
                resolve(Transformer.getResponse(request, source));
            } catch (error) {
                reject(error);
            }
        });

export const getRemoteDataSource =
    (request: string | Request | TubularHttpClientAbstract) =>
    async (gridRequest: GridRequest): Promise<GridResponse> => {
        const httpCast = request as TubularHttpClientAbstract;
        const httpClient: TubularHttpClientAbstract = httpCast.request ? httpCast : new TubularHttpClient(request);

        const data: GridResponse = await httpClient.fetch(gridRequest);

        if (!TubularHttpClient.isValidResponse({ ...data })) {
            throw new Error('Server response is a invalid Tubular object');
        }

        TubularHttpClient.fixResponse(data);

        data.payload = data.payload?.map((row) => parsePayload(row as Record<string, unknown>, gridRequest.columns));

        return data;
    };

export const generateOnRowClickProxy =
    (onRowClick: (row: Record<string, unknown>) => void) => (row: Record<string, unknown>) => (): void => {
        if (onRowClick) {
            onRowClick(row);
        }
    };

function printDoc(gridResult: [], columns: ColumnModel[], gridName: string): void {
    const tableHtml = getHtml(gridResult, columns);

    const documentToPrint = window.open('about:blank', 'Print', 'location=0,height=500,width=800');

    if (!documentToPrint) return;

    documentToPrint.document.write(
        '<link rel="stylesheet" href="//cdn.jsdelivr.net/bootstrap/latest/css/bootstrap.min.css" />',
    );
    documentToPrint.document.title = gridName;
    documentToPrint.document.write('<body onload="window.print();">');
    documentToPrint.document.write(`<h1>${striptags(gridName)}</h1>`);
    documentToPrint.document.write(tableHtml);
    documentToPrint.document.write('</body>');
    documentToPrint.document.close();
}

function exportFile(gridResult: [], columns: ColumnModel[]): void {
    const csvFile = getCsv(gridResult, columns);

    const fileURL = URL.createObjectURL(
        new Blob([`\uFEFF${csvFile}`], {
            type: 'text/csv;charset=utf-8;',
        }),
    );

    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', fileURL);
    downloadLink.setAttribute('id', 'download');
    downloadLink.setAttribute('download', 'data.csv');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(fileURL);
}

export const exportGrid = (media: string, gridResult: [], columns: ColumnModel[], gridName: string) =>
    media === 'csv' ? exportFile(gridResult, columns) : printDoc(gridResult, columns, gridName);
