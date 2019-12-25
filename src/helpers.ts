import Transformer, {
    GridRequest,
    GridResponse,
    TubularHttpClientAbstract,
    parsePayload,
    TubularHttpClient,
} from 'tubular-common';

let id = 0;

export const tbId = () => {
    return `tbComponent_${id++}`;
};

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

    const data: any = await httpClient.fetch(gridRequest);
    if (!TubularHttpClient.isValidResponse(data)) {
        throw new Error('Server response is a invalid Tubular object');
    }

    data.payload = data.payload.map((row: {}) => parsePayload(row, gridRequest.columns));

    return data;
};

export const generateOnRowClickProxy = (onRowClick: any) => {
    return (row: {}) => () => {
        if (onRowClick) {
            onRowClick(row);
        }
    };
};
