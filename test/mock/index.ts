import { ColumnDataType, GridRequest, createColumn, ColumnSortDirection, AggregateFunctions } from "tubular-common";

export const simpleRequest = new GridRequest(
    [
        createColumn('OrderID', {
            dataType: ColumnDataType.Numeric,
            isKey: true,
            label: 'Order ID',
            sortDirection: ColumnSortDirection.Ascending,
            sortOrder: 1,
            sortable: true,
        }),
        createColumn('CustomerName', {
            aggregate: AggregateFunctions.None,
            searchable: true,
            sortable: false,
        }),
        createColumn('ShippedDate', {
            dataType: ColumnDataType.DateTime,
            filterable: true,
            sortable: false,
        }),
        createColumn('ShipperCity'),
        createColumn('Amount', {
            dataType: ColumnDataType.Numeric,
            sortable: false,
        }),
    ],
    10,
    0,
    '',
);

export const simpleResponse = {
    aggregationPayload: {},
    counter: 0,
    currentPage: 1,
    filteredRecordCount: 22,
    payload: [
        {
            OrderID: 1,
            CustomerName: 'Microsoft',
            ShippedDate: '2016-03-19T19:00:00',
            ShipperCity: 'Guadalajara, JAL, Mexico',
            Amount: 300.0,
        },
        {
            OrderID: 2,
            CustomerName: 'Microsoft',
            ShippedDate: '2016-11-08T18:00:00',
            ShipperCity: 'Los Angeles, CA, USA',
            Amount: 9.0,
        },
        {
            OrderID: 3,
            CustomerName: 'Unosquare LLC',
            ShippedDate: '2016-11-08T18:00:00',
            ShipperCity: 'Guadalajara, JAL, Mexico',
            Amount: 92.0,
        },
        {
            OrderID: 4,
            CustomerName: 'Vesta',
            ShippedDate: '2016-03-19T19:00:00',
            ShipperCity: 'Portland, OR, USA',
            Amount: 300.0,
        },
        {
            OrderID: 5,
            CustomerName: 'Super La Playa',
            ShippedDate: '2016-04-23T10:00:00',
            ShipperCity: 'Leon, GTO, Mexico',
            Amount: 174.0,
        },
        {
            OrderID: 6,
            CustomerName: 'OXXO',
            ShippedDate: '2016-12-22T08:00:00',
            ShipperCity: 'Guadalajara, JAL, Mexico',
            Amount: 92.0,
        },
        {
            OrderID: 7,
            CustomerName: 'Super La Playa',
            ShippedDate: '2016-03-19T19:00:00',
            ShipperCity: 'Portland, OR, USA',
            Amount: 300.0,
        },
        {
            OrderID: 8,
            CustomerName: 'Super La Playa',
            ShippedDate: '2016-04-23T10:00:00',
            ShipperCity: 'Leon, GTO, Mexico',
            Amount: 15.0,
        },
        {
            OrderID: 9,
            CustomerName: 'OXXO',
            ShippedDate: '2016-12-22T08:00:00',
            ShipperCity: 'Guadalajara, JAL, Mexico',
            Amount: 92.0,
        },
        {
            OrderID: 10,
            CustomerName: 'Vesta',
            ShippedDate: '2016-03-19T19:00:00',
            ShipperCity: 'Portland, OR, USA',
            Amount: 300.0,
        },
    ],
    totalPages: 3,
    totalRecordCount: 22,
};