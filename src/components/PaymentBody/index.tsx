import { useAtomValue, useSetAtom } from 'jotai';
import { getCustomerByInvoiceIdAtom } from '../../atoms/customers';
import { isInRange, isNotEmpty, useForm } from '@mantine/form';
import { Payment, PaymentMode } from '../../types/payment';
import {
    Button,
    Divider,
    Grid,
    NumberInput,
    Select,
    TextInput,
    Textarea,
} from '@mantine/core';
import { useEffect, useMemo } from 'react';
import { DatePickerInput } from '@mantine/dates';
import { useExchangeRate } from '../../hooks/exchangeRate';
import {
    getInvoiceByIdAtom,
    markInvoiceAsPaidAtom,
} from '../../atoms/invoices';
import { getInvoiceAmount } from '../../utils/invoice';
import { addPaymentAtom } from '../../atoms/payments';
import { notifications } from '@mantine/notifications';

type Props = {
    invoiceId: string | null;
};

type PaymentForm = Omit<Payment, 'id'>;

export const PaymentBody = ({ invoiceId }: Props) => {
    const invoiceAtom = useMemo(
        () => getInvoiceByIdAtom(invoiceId || ''),
        [invoiceId],
    );
    const invoice = useAtomValue(invoiceAtom);
    const customerAtom = useMemo(
        () => getCustomerByInvoiceIdAtom(invoiceId || ''),
        [invoiceId],
    );
    const customer = useAtomValue(customerAtom);
    const exchangeRate = useExchangeRate(customer.currency);

    const form = useForm<PaymentForm>({
        initialValues: {
            customerId: customer.id,
            invoiceId: invoiceId || '',
            amountReceived: getInvoiceAmount(invoice),
            bankCharges: 0,
            paymentDate: new Date().toISOString(),
            paymentMode: PaymentMode[0],
            exchangeRate,
            notes: '',
        },
        validateInputOnBlur: true,
        validate: {
            amountReceived: isInRange(
                { min: 0 },
                'Amount received cannot be negative',
            ),
            bankCharges: isInRange(
                { min: 0 },
                'Bank charges cannot be negative',
            ),
            paymentDate: isNotEmpty('Payment date cannot be empty'),
            exchangeRate: isInRange(
                { min: 0 },
                'Exchange rate cannot be negative',
            ),
            paymentMode: (value) => {
                if (!PaymentMode.includes(value)) {
                    return 'Invalid payment mode';
                }
            },
        },
    });

    const addPayment = useSetAtom(addPaymentAtom);
    const markInvoiceAsPaid = useSetAtom(markInvoiceAsPaidAtom);

    useEffect(() => {
        form.setFieldValue('exchangeRate', exchangeRate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exchangeRate]);
    useEffect(() => {
        form.setFieldValue('amountReceived', getInvoiceAmount(invoice));
        form.setFieldValue('customerId', customer.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoice]);

    function handleSubmit(values: PaymentForm) {
        addPayment({
            ...values,
            id: '',
        });
        markInvoiceAsPaid(invoiceId || '');
        notifications.show({
            title: 'Payment added',
            message: 'Payment has been added successfully',
            color: 'green',
        });
    }

    const paymentDate = new Date(form.values.paymentDate);

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} className='mt-10'>
            <TextInput
                value={customer.name}
                withAsterisk
                disabled
                label='Customer Name'
            />
            <Divider mt={20} />
            <Grid mt={20}>
                <Grid.Col span={6}>
                    <NumberInput
                        withAsterisk
                        label={`Amount Received (${customer.currency})`}
                        {...form.getInputProps('amountReceived')}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <NumberInput
                        label='Bank Charges'
                        {...form.getInputProps('bankCharges')}
                    />
                </Grid.Col>
            </Grid>
            <Divider mt={20} />
            <Grid mt={20}>
                <Grid.Col span={6}>
                    <DatePickerInput
                        withAsterisk
                        label='Payment Date'
                        {...form.getInputProps('paymentDate')}
                        value={paymentDate}
                    />
                    <NumberInput
                        withAsterisk
                        mt={20}
                        label='Exchange Rate'
                        {...form.getInputProps('exchangeRate')}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Select
                        withAsterisk
                        label='Payment Mode'
                        {...form.getInputProps('paymentMode')}
                        data={PaymentMode}
                    />
                </Grid.Col>
            </Grid>
            <Textarea
                mt={20}
                label='Notes'
                {...form.getInputProps('notes')}
                minRows={10}
            />
            <Button
                type='submit'
                variant='filled'
                color='blue'
                className='mt-10'
            >
                Save Payment
            </Button>
        </form>
    );
};
