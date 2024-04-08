import { getCustomersAtom } from '../../atoms/customers';
import { getInvoicesAtom } from '../../atoms/invoices';
import { Invoice } from '../../types/invoice';
import { Container, Flex, Grid, Table, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { InvoiceDetails } from '../../components/InvoiceDetails';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { CompactInvoiceTable } from '../../components/CompactInvoiceTable';
import { InvoicePreviewWithActions } from '../../components/InvoicePreviewWithActions';
import { sortInvoicesByCreationDate } from '../../utils/invoice';
import { getRouteByName } from '../../routes/utils';

export const Invoices = () => {
    const invoices = useAtomValue(getInvoicesAtom);
    const customers = useAtomValue(getCustomersAtom);
    const sortedInvoices = sortInvoicesByCreationDate(Object.values(invoices));

    const [isCompactView, setCompactView] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
        null,
    );

    function _setSelectedInvoiceId(invoice: Invoice) {
        return function () {
            setSelectedInvoiceId(invoice.id);
            setCompactView(true);
        };
    }
    function resetCompactView() {
        setSelectedInvoiceId(null);
        setCompactView(false);
    }

    return (
        <Container size='xxl'>
            <Flex justify='space-between' mb={30}>
                <Text size='xl'>Invoices</Text>
                <Link to={getRouteByName('add_invoice').url}>
                    <Text>Create an invoice</Text>
                </Link>
            </Flex>
            {isCompactView ? (
                <Grid>
                    <Grid.Col span={3}>
                        <CompactInvoiceTable
                            selectedInvoiceId={selectedInvoiceId}
                            onRowClick={_setSelectedInvoiceId}
                        />
                    </Grid.Col>
                    <Grid.Col span={9}>
                        <InvoicePreviewWithActions
                            invoiceId={selectedInvoiceId}
                            goBack={resetCompactView}
                        />
                    </Grid.Col>
                </Grid>
            ) : (
                <Table striped>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Date</Table.Th>
                            <Table.Th>Invoice ID</Table.Th>
                            <Table.Th>Customer Name</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Due Date</Table.Th>
                            <Table.Th>Amount</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {sortedInvoices.map((invoice) => (
                            <InvoiceDetails
                                key={invoice.id}
                                invoice={invoice}
                                customer={customers[invoice.customerId]}
                                onRowClick={_setSelectedInvoiceId(invoice)}
                            />
                        ))}
                    </Table.Tbody>
                </Table>
            )}
        </Container>
    );
};
