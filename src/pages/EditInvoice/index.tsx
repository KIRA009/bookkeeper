import { InvoiceBody } from '../../components/InvoiceBody';
import { Container, Text } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { createGetInvoiceAtom } from '../../atoms/invoices';
import { useAtomValue } from 'jotai';
import { getCustomerAtom } from '../../atoms/customers';
import { useMemo } from 'react';

export const EditInvoice = () => {
    const { id } = useParams();

    const invoiceAtom = useMemo(() => createGetInvoiceAtom(id as string), [id]);
    const invoice = useAtomValue(invoiceAtom);

    const customerAtom = useMemo(
        () => getCustomerAtom(invoice?.customerId as string),
        [invoice?.customerId],
    );
    const customer = useAtomValue(customerAtom);

    return (
        <Container size='xl'>
            <Text component='h1' size='xl'>
                EDIT INVOICE
            </Text>
            <InvoiceBody {...{ invoice, customer }} />
        </Container>
    );
};
