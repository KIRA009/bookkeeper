import { useAtomValue } from 'jotai';
import { getPaymentsAtom } from '../../atoms/payments';
import { ReportTable } from './ReportTable';
import { getCustomersAtom } from '../../atoms/customers';
import { getInvoicesAtom } from '../../atoms/invoices';
import {
    getFormattedInvoiceNumber,
    getInvoiceAmountWithCurrency,
    getInvoiceEditURL,
} from '../../utils/invoice';
import { Link } from 'react-router-dom';

export function PaymentsReceived() {
    const payments = useAtomValue(getPaymentsAtom);
    const customers = useAtomValue(getCustomersAtom);
    const invoices = useAtomValue(getInvoicesAtom);
    return (
        <ReportTable
            columns={[
                {
                    name: 'Date',
                    accessor: (row) =>
                        new Date(row.paymentDate).toLocaleDateString(),
                },
                {
                    name: 'Customer',
                    accessor: (row) => customers[row.customerId].name,
                },
                { name: 'Payment Mode', accessor: 'paymentMode' },
                {
                    name: 'Invoide #',
                    accessor: (row) => {
                        const invoice = invoices[row.invoiceId];
                        return (
                            <Link
                                to={getInvoiceEditURL(invoice)}
                                className='underline'
                            >
                                {getFormattedInvoiceNumber(
                                    invoices[row.invoiceId],
                                )}
                            </Link>
                        );
                    },
                },
                {
                    name: 'Amount',
                    accessor: (row) =>
                        getInvoiceAmountWithCurrency(
                            row.amountReceived,
                            customers[row.customerId],
                        ),
                },
            ]}
            data={Object.values(payments)}
        />
    );
}
