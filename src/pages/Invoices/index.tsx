import { getCustomersAtom } from '../../atoms/customers';
import { getInvoicesAtom } from '../../atoms/invoices';
import { Invoice } from '../../types/invoice';
import { Container, Text } from '@mantine/core';
import { getCustomerFromId } from '../../utils/getCustomerDetails';
import { Link } from 'react-router-dom';
import { InvoiceDetails } from '../../components/InvoiceDetails';
import { useAtomValue } from 'jotai';

const getDate = (invoice: Invoice) => {
    const [day, month, year] = invoice.creationDate.split('/');
    return new Date(month + '/' + day + '/' + year);
};

const comp = (a: Invoice, b: Invoice) => {
    return getDate(b).getTime() - getDate(a).getTime();
};

export const Invoices = () => {
    const invoices = useAtomValue(getInvoicesAtom);
    const customers = useAtomValue(getCustomersAtom);
    const sortedInvoices = [...invoices].sort(comp);
    return (
        <Container size='xs'>
            <Text component='h1' size='xl'>
                INVOICES
                <Link to='/invoice/add/'>
                    <Text>Create an invoice</Text>
                </Link>
            </Text>
            {sortedInvoices.map((invoice) => (
                <InvoiceDetails
                    key={invoice.id}
                    invoice={invoice}
                    customer={getCustomerFromId(customers, invoice.customerId)}
                />
            ))}
        </Container>
    );
};
