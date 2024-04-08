import { InvoiceItem } from './invoice-item';

export enum InvoiceStatus {
    Draft = 'draft',
    Sent = 'sent',
    Paid = 'paid',
}

export interface Invoice {
    id: string;
    customerId: string;
    number: string;
    creationDate: string;
    status: InvoiceStatus;
    subject: string;
    items: InvoiceItem[];
    dueDate: string | null;
}
