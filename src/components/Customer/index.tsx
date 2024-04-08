import { addCustomerAtom, editCustomerAtom } from '../../atoms/customers';
import { Customer as CustomerType } from '../../types/customer';
import {
    TextInput,
    Textarea,
    Button,
    Container,
    Text,
    Flex,
    Select,
    ComboboxItem,
    OptionsFilter,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { createFormContext, isEmail, isNotEmpty } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { States } from './types';
import currencies from '../../currencies.json';
import { getRouteByName } from '../../routes/utils';

const currenciesData = currencies.map((currency) => ({
    value: currency.code,
    label: currency.currency,
}));

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

const optionsFilter: OptionsFilter = ({ options, search }) => {
    return options.filter((option) => {
        const _option = option as ComboboxItem;
        if (
            _option.label.toLowerCase().includes(search.toLowerCase()) ||
            _option.value.toLowerCase().includes(search.toLowerCase())
        ) {
            return true;
        }
        return false;
    });
};

const CustomerForm = ({ state }: Props) => {
    const form = useFormContext();
    return (
        <>
            <TextInput
                label='Name'
                readOnly={!(isAdding(state) || isEditing(state))}
                mb={20}
                withAsterisk
                {...form.getInputProps('name')}
            />
            <Select
                label='Currency'
                readOnly={!(isAdding(state) || isEditing(state))}
                mb={20}
                data={currenciesData}
                searchable
                filter={optionsFilter}
                withAsterisk
                {...form.getInputProps('currency')}
            />
            <Textarea
                label='Address'
                readOnly={!(isAdding(state) || isEditing(state))}
                mb={20}
                {...form.getInputProps('address')}
            />
            <TextInput
                label='Email'
                readOnly={!(isAdding(state) || isEditing(state))}
                mb={20}
                {...form.getInputProps('email')}
            />
            <TextInput
                label='Website'
                readOnly={!(isAdding(state) || isEditing(state))}
                mb={20}
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
                <Text component='h1' size='xl' mb={30}>
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
                            <Link to={getRouteByName('add_invoice').url}>
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
