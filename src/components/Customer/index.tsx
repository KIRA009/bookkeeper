import { addCustomerAtom, editCustomerAtom } from '../../atoms/customers';
import { Customer as CustomerType } from '../../types/customer';
import {
    TextInput,
    Textarea,
    Button,
    Container,
    Text,
    Flex,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { createFormContext, isEmail, isNotEmpty } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { States } from './types';

interface Props {
    state: States;
}

type FormValues = {
    name: string;
    currency: string;
    address: string;
    email?: string;
    website?: string;
};
const [FormProvider, useFormContext, useForm] = createFormContext<FormValues>();

const isViewing = (state: States) => state === States.View;
const isEditing = (state: States) => state === States.Edit;
const isAdding = (state: States) => state === States.Add;

const CustomerForm = ({ state }: Props) => {
    const form = useFormContext();
    return (
        <>
            <TextInput
                label='Name'
                readOnly={!(isAdding(state) || isEditing(state))}
                {...form.getInputProps('name')}
            />
            <TextInput
                label='Currency'
                readOnly={!(isAdding(state) || isEditing(state))}
                {...form.getInputProps('currency')}
            />
            <Textarea
                label='Address'
                readOnly={!(isAdding(state) || isEditing(state))}
                {...form.getInputProps('address')}
            />
            <TextInput
                label='Email'
                readOnly={!(isAdding(state) || isEditing(state))}
                {...form.getInputProps('email')}
            />
            <TextInput
                label='Website'
                readOnly={!(isAdding(state) || isEditing(state))}
                {...form.getInputProps('website')}
            />
        </>
    );
};

const Customer = ({ state }: Props) => {
    const form = useForm({
        initialValues: {
            name: '',
            currency: '',
            address: '',
            email: '',
            website: '',
        },
        validateInputOnBlur: true,
        validate: {
            name: isNotEmpty('Name is required'),
            currency: isNotEmpty('Currency is required'),
            address: isNotEmpty('Address is required'),
            email: (value) => (value ? isEmail('Invalid email')(value) : null),
        },
    });

    const addCustomer = useSetAtom(addCustomerAtom);
    const editCustomer = useSetAtom(editCustomerAtom);

    const _addCustomer = (values: FormValues) => {
        const newCustomer: CustomerType = {
            id: '',
            ...values,
        };
        addCustomer(newCustomer);
        notifications.show({
            title: 'Customer added',
            message: `Customer ${values.name} has been added successfully`,
            color: 'teal',
        });
    };
    const _editCustomer = (values: FormValues) => {
        const newCustomer: CustomerType = {
            id: '',
            ...values,
        };
        editCustomer(newCustomer);
        notifications.show({
            title: 'Customer updated',
            message: `Customer ${values.name} has been updated successfully`,
            color: 'teal',
        });
    };

    return (
        <FormProvider form={form}>
            <Container size='xs'>
                <Text component='h1' size='xl'>
                    {isViewing(state)
                        ? `VIEW CUSTOMER DETAILS`
                        : isEditing(state)
                          ? `EDIT CUSTOMER DETAILS`
                          : `ADD NEW CUSTOMER`}
                </Text>
                {isViewing(state) ? (
                    <CustomerForm state={state} />
                ) : (
                    <form
                        onSubmit={form.onSubmit((values) =>
                            isAdding(state)
                                ? _addCustomer(values)
                                : _editCustomer(values),
                        )}
                    >
                        <CustomerForm state={state} />
                        <Flex justify='space-between' align='flex-end'>
                            <Link to='/invoice/add/'>
                                <Text>Create an invoice</Text>
                            </Link>
                            <Button type='submit' variant='filled'>
                                {isAdding(state) ? `Add` : `Save changes`}
                            </Button>
                        </Flex>
                    </form>
                )}
            </Container>
        </FormProvider>
    );
};

export { Customer };
