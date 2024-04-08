import { useAtomValue } from 'jotai';
import { getInvoicesAtom } from '../../atoms/invoices';
import { Flex, List, Text } from '@mantine/core';
import { getCustomersAtom } from '../../atoms/customers';
import { dateToString } from '../../utils/date';
import {
    getInvoiceAmount,
    getInvoiceAmountWithCurrency,
    sortInvoicesByCreationDate,
} from '../../utils/invoice';
import { Invoice, InvoiceStatus } from '../../types/invoice';

type Props = {
    selectedInvoiceId: string | null;
    onRowClick: (invoice: Invoice) => () => void;
};

export const CompactInvoiceTable = ({
    selectedInvoiceId,
    onRowClick,
}: Props) => {
    const invoices = useAtomValue(getInvoicesAtom);
    const sortedInvoices = sortInvoicesByCreationDate(Object.values(invoices));
    const customers = useAtomValue(getCustomersAtom);
    return (
        <List>
            {sortedInvoices.map((invoice) => {
                const customer = customers[invoice.customerId];
                const invoiceAmount = getInvoiceAmount(invoice);
                const invoiceStatusColor =
                    invoice.status === InvoiceStatus.Paid ? 'green' : 'gray';
                return (
                    <List.Item
                        p={20}
                        key={invoice.id}
                        classNames={{
                            itemWrapper: 'w-full',
                            itemLabel: 'w-full',
                            item:
                                selectedInvoiceId === invoice.id
                                    ? 'bg-gray-100'
                                    : '' + ' hover:cursor-pointer',
                        }}
                        onClick={onRowClick(invoice)}
                    >
                        <Flex columnGap={20} justify='space-between'>
                            <Flex direction='column'>
                                <Text>{customer.name}</Text>
                                <Flex columnGap={10}>
                                    <Text>{invoice.number}</Text>
                                    <Text>|</Text>
                                    <Text>
                                        {dateToString(invoice.creationDate)}
                                    </Text>
                                </Flex>
                            </Flex>
                            <Flex
                                direction='column'
                                align='end'
                                justify='space-between'
                            >
                                <Text>
                                    {getInvoiceAmountWithCurrency(
                                        invoiceAmount,
                                        customer,
                                    )}
                                </Text>
                                <Text size='sm' c={invoiceStatusColor}>
                                    {invoice.status.toUpperCase()}
                                </Text>
                            </Flex>
                        </Flex>
                    </List.Item>
                );
            })}
        </List>
    );
};
