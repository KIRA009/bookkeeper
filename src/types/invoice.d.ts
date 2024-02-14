import { InvoiceItem } from './invoice-item';

export interface Invoice {
    id: string;
    customerId: string;
    number: string;
    creationDate: string;
    subject: string;
    items: InvoiceItem[];
    dueDate: string | null;
}
