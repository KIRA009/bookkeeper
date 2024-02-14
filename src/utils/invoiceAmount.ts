import { Customer } from '../types/customer';
import { Invoice } from '../types/invoice';

export const getInvoiceAmount = (invoice: Invoice): number => {
    return invoice.items.reduce((a, b) => a + b.quantity * b.rate, 0);
};

export const getInvoiceAmountInString = (
    sum: number,
    customer: Customer,
): string => {
    return sum.toLocaleString('en-US', {
        style: 'currency',
        currency: customer.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
};

export const getLongStringCurrency = (customer: Customer): string => {
    const currencyString = new Intl.DisplayNames(['en'], {
        type: 'currency',
    }).of(customer.currency);
    if (!currencyString) return '';
    return currencyString;
};
