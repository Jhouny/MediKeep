import { useEffect, useState } from 'react';
import { Table, Loader, Center } from '@mantine/core';
import type { AxiosResponse } from 'axios';
import { formatFunction } from '../utils/formatter';

type DataTableProps<T> = {
    fetchData: () => Promise<AxiosResponse<T[]>>;
    headers?: string[];  // Optional list of headers to use for the table (must be in order of data keys)
    refreshkey?: boolean; // Optional key to trigger re-fetching of data
};

 // This regex matches ISO 8601 date strings
let datetimePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;    

export function DataTable<T>({ fetchData, headers, refreshkey }: DataTableProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const result = await fetchData();
                // Verify that result.data is an array
                if (!Array.isArray(result.data)) {
                    throw new Error('Expected an array from fetchData');
                }
                setData(result.data);
            } catch {
                setData([]);
                console.error("Failed to fetch data");
            }
            setLoading(false);
        };
        load();
    }, [fetchData, refreshkey]);

    if (loading) {
        return (
            <Center>
                <Loader />
            </Center>
        );
    }

    if (!data.length) {
        return <div>No data found.</div>;
    }

    // If headers are provided, use them; otherwise, derive from data keys
    const tableHeaders = headers ?? Object.keys(data[0] as object);

    // Filter data to only include keys that are in the headers
    const filteredData = data.map((item) => {
        const filteredItem: Record<string, unknown> = {};
        const itemObj = item as Record<string, unknown>;
        for (const header of tableHeaders) {
            filteredItem[header] = itemObj[header];
        }
        return filteredItem;
    });

    // Process dates in the data
    filteredData.forEach((item) => {
        Object.keys(item).forEach((key) => {
            if (datetimePattern.test(item[key] as string)) {
                item[key] = formatFunction(item[key] as string, 'date');
            } 
        });
    });

    const headerCells = tableHeaders.map((header, index) => (
        <Table.Th key={index} style={{ textAlign: 'center' }}>
            {header}
        </Table.Th>
    ));

    const bodyRows = filteredData.map((row, rowIndex) => (
        <Table.Tr key={rowIndex}>
            {tableHeaders.map((header, cellIndex) => (
                <Table.Td key={cellIndex} style={{ textAlign: 'center' }}>
                    {row[header] ? row[header].toString() : ''}
                </Table.Td>
            ))}
        </Table.Tr>
    ));

    return (
        <Table
            highlightOnHover
            stickyHeader
            striped
            align='center'
            style={{
                tableLayout: 'fixed',
                textAlign: 'center',
            }}
        >
            <Table.Thead>
                <tr>{headerCells}</tr>
            </Table.Thead>
            <Table.Tbody>{bodyRows}</Table.Tbody>
        </Table>
    );
}
