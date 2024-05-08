import { Payment } from '../types/payment';
import { atom } from 'jotai';
import { atomWithLocalStorage } from './utils';

type initialState = Record<string, Payment>;

const paymentsAtom = atomWithLocalStorage<initialState>(
    'bookkeeper:payments',
    {},
);

export const addPaymentAtom = atom(null, (get, set, payload: Payment) => {
    const id = crypto.randomUUID();
    set(paymentsAtom, {
        ...get(paymentsAtom),
        [id]: { ...payload, id },
    });
});

export const editPaymentAtom = atom(null, (get, set, payload: Payment) => {
    set(paymentsAtom, {
        ...get(paymentsAtom),
        [payload.id]: payload,
    });
});

export const getPaymentsAtom = atom((get) => get(paymentsAtom));
export const getPaymentAtom = (id: string) =>
    atom((get) => get(paymentsAtom)[id]);
export const getPaymentByInvoiceIdAtom = (invoiceId: string) =>
    atom((get) => {
        const payments = get(paymentsAtom);
        return Object.values(payments).find(
            (payment) => payment.invoiceId === invoiceId,
        );
    });
