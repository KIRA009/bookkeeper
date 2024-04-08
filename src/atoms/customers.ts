import { atomWithStorage } from 'jotai/utils';
import { Customer } from '../types/customer';
import { atom } from 'jotai';
import { invoicesAtom } from './invoices';

type initialState = Record<string, Customer>;

export const EmptyCustomer: Customer = {
    id: '',
    name: '',
    address: '',
    currency: '',
};

const customersAtom = atomWithStorage<initialState>('bookkeeper:customers', {});

export const addCustomerAtom = atom(null, (get, set, payload: Customer) => {
    const id = crypto.randomUUID();
    set(customersAtom, {
        ...get(customersAtom),
        [id]: { ...payload, id },
    });
});

export const editCustomerAtom = atom(null, (get, set, payload: Customer) => {
    set(customersAtom, {
        ...get(customersAtom),
        [payload.id]: payload,
    });
});

export const getCustomersAtom = atom((get) => get(customersAtom));
export const getCustomerAtom = (id: string) =>
    atom((get) => get(customersAtom)[id]);
export const getCustomerByInvoiceIdAtom = (invoiceId: string) =>
    atom((get) => {
        const invoices = get(invoicesAtom);
        const customers = get(customersAtom);
        const invoice = invoices[invoiceId];
        return customers[invoice.customerId];
    });
