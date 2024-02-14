import { Select, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { getLongStringCurrency } from '../../utils/invoiceAmount';
import { useAtomValue } from 'jotai';
import { UseFormReturnType } from '@mantine/form';
import { Invoice } from '../../types/invoice';
import { getCustomersAtom } from '../../atoms/customers';

interface Props {
    useFormContext: () => UseFormReturnType<Omit<Invoice, 'id'>>;
}

export const CustomerSelector = ({ useFormContext }: Props) => {
    const form = useFormContext();
    const customers = useAtomValue(getCustomersAtom);

    return (
        <div>
            <Select
                label='Select customer'
                placeholder='Pick one'
                data={customers.map((customer) => ({
                    value: customer.id,
                    label:
                        customer.name + ' - ' + getLongStringCurrency(customer),
                }))}
                {...form.getInputProps('customerId')}
            />
            <Link to='/customer/add/'>
                <Text className='text-right'>Create a customer</Text>
            </Link>
        </div>
    );
};
