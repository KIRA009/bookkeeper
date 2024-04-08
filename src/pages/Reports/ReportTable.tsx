import { Table } from '@mantine/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props<T extends Record<string, any>> = {
    columns: {
        name: string;
        accessor: string | ((row: T) => React.ReactNode);
    }[];
    data: T[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReportTable<T extends Record<string, any>>({
    columns,
    data,
}: Props<T>) {
    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    {columns.map(({ name }) => (
                        <Table.Th key={name}>{name}</Table.Th>
                    ))}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {data.map((row, index) => (
                    <Table.Tr key={index}>
                        {columns.map(({ accessor }, index) => (
                            <Table.Td key={index}>
                                {typeof accessor === 'string'
                                    ? row[accessor]
                                    : accessor(row)}
                            </Table.Td>
                        ))}
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    );
}
