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
import { Filter, useFilters } from '../../hooks/filters';
import { Filters } from '../../components/Filters';

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

    const {
        filters,
        updateFilter,
        filteredObjs: filteredInvoices,
    } = useFilters(
        sortedInvoices,
        [
            { value: '', type: 'date' },
            { value: '', type: 'customer' },
        ],
        getInvoicesFilterCmpFunctions,
    );

    return (
        <Container size='xxl'>
            <Filters filters={filters} updateFilter={updateFilter} />
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
                        {filteredInvoices.map((invoice) => (
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

function getInvoicesFilterCmpFunctions(
    filters: Filter[],
): ((invoice: Invoice) => boolean)[] {
    const filterFns = [];
    for (const filter of filters) {
        if (filter.type === 'date') {
            if (filter.value === 'today') {
                filterFns.push((invoice: Invoice) => {
                    const invoiceDate = new Date(invoice.creationDate);
                    const today = new Date();
                    return (
                        invoiceDate.getDate() === today.getDate() &&
                        invoiceDate.getMonth() === today.getMonth() &&
                        invoiceDate.getFullYear() === today.getFullYear()
                    );
                });
            } else if (filter.value === 'this-week') {
                filterFns.push((invoice: Invoice) => {
                    const invoiceDate = new Date(invoice.creationDate);
                    const today = new Date();
                    const day = today.getDay();
                    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
                    const weekStart = new Date(today.setDate(diff));
                    return invoiceDate >= weekStart;
                });
            } else if (filter.value === 'last-week') {
                filterFns.push((invoice: Invoice) => {
                    const invoiceDate = new Date(invoice.creationDate);
                    const today = new Date();
                    const day = today.getDay();
                    const diff = today.getDate() - day - 6;
                    const weekStart = new Date(today.setDate(diff));
                    const lastWeekStart = new Date(
                        weekStart.setDate(weekStart.getDate() - 7),
                    );
                    return (
                        invoiceDate >= lastWeekStart && invoiceDate < weekStart
                    );
                });
            } else if (filter.value === 'this-month') {
                filterFns.push((invoice: Invoice) => {
                    const invoiceDate = new Date(invoice.creationDate);
                    const today = new Date();
                    return (
                        invoiceDate.getMonth() === today.getMonth() &&
                        invoiceDate.getFullYear() === today.getFullYear()
                    );
                });
            } else if (filter.value === 'last-month') {
                filterFns.push((invoice: Invoice) => {
                    const invoiceDate = new Date(invoice.creationDate);
                    const today = new Date();
                    const lastMonth = new Date(
                        today.getFullYear(),
                        today.getMonth() - 1,
                        1,
                    );
                    const thisMonth = new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        1,
                    );
                    return invoiceDate >= lastMonth && invoiceDate < thisMonth;
                });
            } else if (filter.value === 'this-year') {
                filterFns.push((invoice: Invoice) => {
                    const invoiceDate = new Date(invoice.creationDate);
                    // current fiscal year, starting from April 1st to March 31st
                    const today = new Date();
                    const fiscalYearStart = new Date(today.getFullYear(), 3, 1);
                    const fiscalYearEnd = new Date(
                        today.getFullYear() + 1,
                        2,
                        31,
                    );
                    return (
                        invoiceDate >= fiscalYearStart &&
                        invoiceDate <= fiscalYearEnd
                    );
                });
            } else if (filter.value === 'last-year') {
                filterFns.push((invoice: Invoice) => {
                    const invoiceDate = new Date(invoice.creationDate);
                    // last fiscal year, starting from April 1st to March 31st
                    const today = new Date();
                    const fiscalYearStart = new Date(
                        today.getFullYear() - 1,
                        3,
                        1,
                    );
                    const fiscalYearEnd = new Date(today.getFullYear(), 2, 31);
                    return (
                        invoiceDate >= fiscalYearStart &&
                        invoiceDate <= fiscalYearEnd
                    );
                });
            } else {
                filterFns.push(() => true);
            }
        }
        if (filter.type === 'customer') {
            if (filter.value === '') {
                filterFns.push(() => true);
            } else {
                filterFns.push(
                    (invoice: Invoice) => invoice.customerId === filter.value,
                );
            }
        }
    }
    return filterFns;
}
