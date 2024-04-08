import { Container, Text } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { PaymentBody } from '../../components/PaymentBody';

export const AddPayment = () => {
    const { id: invoiceId } = useParams();
    if (!invoiceId) {
        return null;
    }

    return (
        <Container size='md'>
            <Text component='h1' size='xl'>
                ADD PAYMENT
            </Text>
            <PaymentBody invoiceId={invoiceId} />
        </Container>
    );
};
