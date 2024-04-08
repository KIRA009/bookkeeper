import { Select, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { getLongStringCurrency } from '../../utils/invoice';
import { useAtomValue } from 'jotai';
import { UseFormReturnType } from '@mantine/form';
import { Invoice } from '../../types/invoice';
import { getCustomersAtom } from '../../atoms/customers';
import { getRouteByName } from '../../routes/utils';

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
                data={Object.values(customers).map((customer) => ({
                    value: customer.id,
                    label:
                        customer.name + ' - ' + getLongStringCurrency(customer),
                }))}
                {...form.getInputProps('customerId')}
            />
            <Link to={getRouteByName('add_customer').url}>
                <Text className='text-right'>Create a customer</Text>
            </Link>
        </div>
    );
};
