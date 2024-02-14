import { atom } from 'jotai';
import { Invoice } from '../types/invoice';
import { atomWithStorage } from 'jotai/utils';

type initialState = Invoice[];

export const invoicesAtom = atomWithStorage<initialState>(
    'bookkeeper:invoices',
    [],
);

export const addInvoiceAtom = atom(null, (get, set, payload: Invoice) => {
    const id = crypto.randomUUID();
    set(invoicesAtom, [...get(invoicesAtom), { ...payload, id }]);
});

export const editInvoiceAtom = atom(null, (get, set, payload: Invoice) => {
    const invoiceIndex = get(invoicesAtom).findIndex(
        (invoice) => invoice.id === payload.id,
    );
    if (invoiceIndex !== -1) {
        const newInvoices = [...get(invoicesAtom)];
        newInvoices[invoiceIndex] = payload;
        set(invoicesAtom, newInvoices);
    }
});

export const deleteInvoiceAtom = atom(null, (get, set, id: string) => {
    const invoiceIndex = get(invoicesAtom).findIndex(
        (invoice) => invoice.id === id,
    );
    if (invoiceIndex !== -1) {
        const newInvoices = [...get(invoicesAtom)];
        newInvoices.splice(invoiceIndex, 1);
        set(invoicesAtom, newInvoices);
    }
});

export const getInvoicesAtom = atom((get) => get(invoicesAtom));
export const createGetInvoiceAtom = (id: string) =>
    atom((get) => get(invoicesAtom).find((invoice) => invoice.id === id));
