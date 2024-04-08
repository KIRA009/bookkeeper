import { Table } from '@mantine/core';
import { Customer } from '../../types/customer';
import { Invoice } from '../../types/invoice';
import {
    getFormattedInvoiceNumber,
    getInvoiceAmount,
    getInvoiceAmountWithCurrency,
} from '../../utils/invoice';

interface Props {
    invoice: Invoice;
    customer: Customer;
    onRowClick?: () => void;
}

export const InvoiceDetails = ({ invoice, customer, onRowClick }: Props) => {
    const sumWithSymbol = getInvoiceAmountWithCurrency(
        getInvoiceAmount(invoice),
        customer,
    );
    const creationDate = new Date(invoice.creationDate);
    const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;

    const creationDateString = creationDate.toLocaleDateString('en-UK', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const dueDateString = dueDate?.toLocaleDateString('en-UK', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    return (
        <Table.Tr onClick={onRowClick} className='hover:cursor-pointer'>
            <Table.Td>{creationDateString}</Table.Td>
            <Table.Td>{getFormattedInvoiceNumber(invoice)}</Table.Td>
            <Table.Td>{customer.name}</Table.Td>
            <Table.Td>{invoice.status.toUpperCase()}</Table.Td>
            <Table.Td>{dueDateString}</Table.Td>
            <Table.Td>{sumWithSymbol}</Table.Td>
        </Table.Tr>
    );
};
