import { Customer } from '../../types/customer';
import { Invoice } from '../../types/invoice';
import { Payment } from '../../types/payment';

export function validateImportData(data: {
    invoices: Record<string, Invoice>;
    payments: Record<string, Payment>;
    customers: Record<string, Customer>;
}) {
    const { invoices, payments, customers } = data;
    for (const payment of Object.values(payments)) {
        if (!invoices[payment.invoiceId]) {
            return 'Payment references non-existent invoice';
        }
        if (!customers[payment.customerId]) {
            return 'Payment references non-existent customer';
        }
    }
    for (const invoice of Object.values(invoices)) {
        if (!customers[invoice.customerId]) {
            return 'Invoice references non-existent customer';
        }
    }
    return null;
}
