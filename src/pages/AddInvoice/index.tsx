import { InvoiceBody } from '../../components/InvoiceBody';
import { Container, Text } from '@mantine/core';

export const AddInvoice = () => {
    return (
        <Container size='xl'>
            <Text component='h1' size='xl'>
                NEW INVOICE
            </Text>
            <InvoiceBody />
        </Container>
    );
};
