import { useAtomValue, useSetAtom } from 'jotai';
import { editInvoiceAtom, getInvoicesAtom } from '../../atoms/invoices';
import { editPaymentAtom, getPaymentsAtom } from '../../atoms/payments';
import { editCustomerAtom, getCustomersAtom } from '../../atoms/customers';
import { editSettingsAtom, getSettingsAtom } from '../../atoms/settings';
import {
    Button,
    FileButton,
    Group,
    Stack,
    Table,
    Tabs,
    Text,
} from '@mantine/core';
import { IconDownload, IconShare } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { validateImportData } from './utils';
import { Settings } from '../../types/settings';
import { Customer } from '../../types/customer';
import { Payment } from '../../types/payment';
import { Invoice } from '../../types/invoice';
import { notifications } from '@mantine/notifications';

export const DataForm = () => {
    return (
        <Tabs defaultValue='export'>
            <Tabs.List justify='center' w='fit-content' mx='auto' mt={30}>
                <Tabs.Tab value='export' leftSection={<IconShare />}>
                    Export
                </Tabs.Tab>
                <Tabs.Tab value='import' leftSection={<IconDownload />}>
                    Import
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value='export'>
                <ExportForm />
            </Tabs.Panel>

            <Tabs.Panel value='import'>
                <ImportForm />
            </Tabs.Panel>
        </Tabs>
    );
};

type DataTableProps = {
    invoices: Invoice[];
    payments: Payment[];
    customers: Customer[];
    settings?: Settings;
};

const DataTable = ({ invoices, payments, customers }: DataTableProps) => {
    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Data type</Table.Th>
                    <Table.Th>Count</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Td>Invoices</Table.Td>
                    <Table.Td>{invoices.length}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>Payments</Table.Td>
                    <Table.Td>{payments.length}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>Customers</Table.Td>
                    <Table.Td>{customers.length}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>Settings</Table.Td>
                    <Table.Td>1</Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    );
};

const ExportForm = () => {
    const invoices = useAtomValue(getInvoicesAtom);
    const payments = useAtomValue(getPaymentsAtom);
    const customers = useAtomValue(getCustomersAtom);
    const settings = useAtomValue(getSettingsAtom);

    function downloadObjectAsJson() {
        const finalJSON = {
            invoices,
            payments,
            customers,
            settings,
        };
        const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(finalJSON));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', 'bookkeeper.json');
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
    }
    return (
        <Stack gap='md' mt={20}>
            <DataTable
                invoices={Object.values(invoices)}
                payments={Object.values(payments)}
                customers={Object.values(customers)}
            />
            <Button onClick={downloadObjectAsJson} w='fit-content'>
                Export all data
            </Button>
        </Stack>
    );
};

type ImportFormProps = {
    invoices: Record<string, Invoice>;
    payments: Record<string, Payment>;
    customers: Record<string, Customer>;
    settings: Settings;
};
const ImportForm = () => {
    const [importedData, setImportedData] = useState<ImportFormProps | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<() => void>(null);

    const editSettings = useSetAtom(editSettingsAtom);
    const editInvoice = useSetAtom(editInvoiceAtom);
    const editPayment = useSetAtom(editPaymentAtom);
    const editCustomer = useSetAtom(editCustomerAtom);

    function handleFileChange(file: File | null) {
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            const data = JSON.parse(reader.result as string);
            const error = validateImportData(data);
            if (error) {
                clearImportedData();
                setError(error);
                return;
            }
            setError(null);
            setImportedData(data);
        };
    }
    function clearImportedData() {
        setImportedData(null);
        fileRef.current?.();
        setError(null);
    }
    function importData() {
        if (!importedData) {
            return;
        }
        const { invoices, payments, customers, settings } = importedData;
        if (settings) {
            editSettings(settings);
        }
        for (const invoice of Object.values(invoices)) {
            editInvoice(invoice);
        }
        for (const payment of Object.values(payments)) {
            editPayment(payment);
        }
        for (const customer of Object.values(customers)) {
            editCustomer(customer);
        }
        clearImportedData();
        notifications.show({
            title: 'Data imported',
            message: 'Data imported successfully',
            color: 'green',
        });
    }
    return (
        <Stack gap='md' mt={30} align='center'>
            <Group justify='center'>
                {importedData && (
                    <Button
                        onClick={clearImportedData}
                        variant='light'
                        color='red'
                    >
                        Clear imported data
                    </Button>
                )}
                <FileButton onChange={handleFileChange} resetRef={fileRef}>
                    {(props) => (
                        <Button {...props} w='fit-content' variant='default'>
                            Upload bookkeeper data
                        </Button>
                    )}
                </FileButton>
            </Group>
            {error && <Text c='red'>{error}</Text>}
            {importedData && (
                <>
                    <DataTable
                        invoices={Object.values(importedData.invoices)}
                        payments={Object.values(importedData.payments)}
                        customers={Object.values(importedData.customers)}
                    />
                    <Button w='fit-content' onClick={importData}>
                        Import data
                    </Button>
                </>
            )}
        </Stack>
    );
};
