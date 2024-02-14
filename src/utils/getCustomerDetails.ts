import { EmptyCustomer } from '../atoms/customers';
import { Customer } from '../types/customer';

export const getCustomerFromId = (
    customers: Customer[],
    customerId: string,
): Customer => {
    const customer = customers.find((customer) => customer.id === customerId);
    if (customer) return customer;
    return EmptyCustomer;
};
