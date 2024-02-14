import { useEffect, useMemo } from 'react';
import {
    addInvoiceAtom,
    editInvoiceAtom,
    getInvoicesAtom,
} from '../../atoms/invoices';
import { CustomerSelector } from '../CustomerSelector';
import { ItemList } from '../ItemList';
import { Invoice } from '../../types/invoice';
import { TextInput, Button, Text, Flex } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Link } from 'react-router-dom';
import { Customer } from '../../types/customer';
import { useAtomValue, useSetAtom } from 'jotai';
import { createFormContext, isNotEmpty } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface Props {
    invoice?: Invoice;
    customer?: Customer;
}

type FormValues = Omit<Invoice, 'id'>;
const [FormProvider, useFormContext, useForm] = createFormContext<FormValues>();

export const InvoiceBody = ({ invoice, customer }: Props) => {
    const invoices = useAtomValue(getInvoicesAtom);
    const defaultInvoiceNum = useMemo(() => {
        let maxInvoiceNum = 0;
        for (const invoice of invoices) {
            if (!isNaN(Number(invoice.number))) {
                maxInvoiceNum = Math.max(maxInvoiceNum, Number(invoice.number));
            }
        }
        const newInvoiceNum = maxInvoiceNum + 1;
        return String(newInvoiceNum).padStart(6, '0');
    }, [invoices]);
    const form = useForm({
        initialValues: {
            customerId: customer ? customer.id : '',
            number: invoice ? invoice.number : defaultInvoiceNum,
            creationDate: invoice
                ? invoice.creationDate
                : new Date().toISOString(),
            dueDate: invoice ? invoice.dueDate : null,
            subject: invoice ? invoice.subject : '',
            items: invoice
                ? invoice.items
                : [{ itemDetail: '', quantity: 0, rate: 0 }],
        },
        validateInputOnBlur: true,
        validate: {
            customerId: isNotEmpty('Customer is required'),
            number: isNotEmpty('Invoice number is required'),
            creationDate: isNotEmpty('Invoice date is required'),
            subject: isNotEmpty('Subject is required'),
            items: {
                itemDetail: isNotEmpty('Item detail is required'),
                quantity: (value) => {
                    if (value === 0) {
                        return 'Quantity cannot be 0';
                    }
                },
                rate: (value) => {
                    if (value === 0) {
                        return 'Rate cannot be 0';
                    }
                },
            },
        },
    });

    const editMode = invoice ? true : false;

    const editInvoice = useSetAtom(editInvoiceAtom);
    const addInvoice = useSetAtom(addInvoiceAtom);

    useEffect(() => {
        if (invoice) {
            form.setFieldValue('customerId', invoice.customerId);
            form.setFieldValue('number', invoice.number);
            form.setFieldValue('creationDate', invoice.creationDate);
            form.setFieldValue('dueDate', invoice.dueDate);
            form.setFieldValue('subject', invoice.subject);
            form.setFieldValue('items', invoice.items);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoice]);

    const save = (values: FormValues) => {
        const _invoice = {
            id: invoice ? invoice.id : '',
            ...values,
        };
        if (values.items.length === 0) {
            return;
        }

        if (editMode) {
            editInvoice(_invoice);
            notifications.show({
                title: 'Invoice updated',
                message: `Invoice ${_invoice.number} has been updated`,
                color: 'teal',
            });
        } else {
            addInvoice(_invoice);
            notifications.show({
                title: 'Invoice added',
                message: `Invoice ${_invoice.number} has been added`,
                color: 'teal',
            });
        }
    };

    const dueDate = form.values.dueDate ? new Date(form.values.dueDate) : null;

    return (
        <FormProvider form={form}>
            <form onSubmit={form.onSubmit(save)}>
                <CustomerSelector useFormContext={useFormContext} />
                <TextInput
                    label='Invoice Number'
                    {...form.getInputProps('number')}
                />
                <DatePickerInput
                    label='Invoice date'
                    {...form.getInputProps('creationDate')}
                    value={new Date(form.values.creationDate)}
                />
                <DatePickerInput
                    label='Invoice due date'
                    {...form.getInputProps('dueDate')}
                    value={dueDate}
                />
                <TextInput label='Subject' {...form.getInputProps('subject')} />
                <ItemList form={form} />
                <Flex justify='space-between' align='flex-end'>
                    <Link to='/invoices'>
                        <Text>View your invoices</Text>
                    </Link>
                    <Button type='submit' variant='filled'>
                        {editMode ? 'Edit invoice' : 'Add Invoice'}
                    </Button>
                </Flex>
            </form>
        </FormProvider>
    );
};
