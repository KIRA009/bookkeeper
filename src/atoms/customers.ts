import { atomWithStorage } from 'jotai/utils';
import { Customer } from '../types/customer';
import { atom } from 'jotai';

type initialState = Customer[];

export const EmptyCustomer: Customer = {
    id: '',
    name: '',
    address: '',
    currency: '',
};

const customersAtom = atomWithStorage<initialState>('bookkeeper:customers', []);

export const addCustomerAtom = atom(null, (get, set, payload: Customer) => {
    const id = crypto.randomUUID();
    set(customersAtom, [...get(customersAtom), { ...payload, id }]);
});

export const editCustomerAtom = atom(null, (get, set, payload: Customer) => {
    const customerIndex = get(customersAtom).findIndex(
        (customer) => customer.id === payload.id,
    );
    if (customerIndex !== -1) {
        const newCustomers = [...get(customersAtom)];
        newCustomers[customerIndex] = payload;
        set(customersAtom, newCustomers);
    }
});

export const getCustomersAtom = atom((get) => get(customersAtom));
export const getCustomerAtom = (id: string) =>
    atom((get) => get(customersAtom).find((customer) => customer.id === id));
