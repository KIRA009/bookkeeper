import { atom } from 'jotai';
import { Invoice, InvoiceStatus } from '../types/invoice';
import { atomWithStorage } from 'jotai/utils';

type initialState = Record<string, Invoice>;

export const invoicesAtom = atomWithStorage<initialState>(
    'bookkeeper:invoices',
    {},
);

export const addInvoiceAtom = atom(null, (get, set, payload: Invoice) => {
    const id = crypto.randomUUID();
    set(invoicesAtom, {
        ...get(invoicesAtom),
        [id]: { ...payload, id },
    });
});

export const editInvoiceAtom = atom(null, (get, set, payload: Invoice) => {
    set(invoicesAtom, {
        ...get(invoicesAtom),
        [payload.id]: payload,
    });
});

export const deleteInvoiceAtom = atom(null, (get, set, id: string) => {
    const newInvoices = { ...get(invoicesAtom) };
    delete newInvoices[id];
    set(invoicesAtom, newInvoices);
});

export const markInvoiceAsSentAtom = atom(null, (get, set, id: string) => {
    set(editInvoiceAtom, {
        ...get(invoicesAtom)[id],
        status: InvoiceStatus.Sent,
    });
});

export const markInvoiceAsPaidAtom = atom(null, (get, set, id: string) => {
    set(editInvoiceAtom, {
        ...get(invoicesAtom)[id],
        status: InvoiceStatus.Paid,
    });
});

export const getInvoicesAtom = atom((get) => get(invoicesAtom));
export const createGetInvoiceAtom = (id: string) =>
    atom((get) => get(invoicesAtom)[id]);
export const getInvoiceByIdAtom = (id: string) =>
    atom((get) => get(invoicesAtom)[id]);
