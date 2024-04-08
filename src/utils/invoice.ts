import { Customer } from '../types/customer';
import { Invoice } from '../types/invoice';

export const getInvoiceAmount = (invoice: Invoice | undefined): number => {
    if (!invoice) return 0;
    return invoice.items.reduce((a, b) => a + b.quantity * b.rate, 0);
};

export const getInvoiceAmountWithCurrency = (
    sum: number,
    customer: Customer,
): string => {
    return sum.toLocaleString('en-US', {
        style: 'currency',
        currency: customer.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const getFormattedInvoiceAmount = (sum: number): string => {
    return sum.toLocaleString('en-US', {
        minimumFractionDigits: 2,
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

export const getFormattedInvoiceNumber = (invoice: Invoice): string => {
    return `INV-${invoice.number}`;
};

export const getInvoiceEditURL = (invoice: Invoice): string => {
    return `/invoices/edit/${invoice.id}`;
};

export const sortInvoicesByCreationDate = (invoices: Invoice[]): Invoice[] => {
    return invoices.sort((a, b) => {
        const dateA = new Date(a.creationDate).getTime();
        const dateB = new Date(b.creationDate).getTime();
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        if (dateA === dateB) {
            const invoiceNumberA = Number(a.number);
            const invoiceNumberB = Number(b.number);
            if (invoiceNumberA > invoiceNumberB) return -1;
            return 1;
        } else {
            return 0;
        }
    });
};
