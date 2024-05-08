import { useAtomValue } from 'jotai';
import { getPaymentsAtom } from '../../atoms/payments';
import { ReportTable } from './ReportTable';
import { getCustomersAtom } from '../../atoms/customers';
import { getInvoicesAtom } from '../../atoms/invoices';
import {
    getAmountInInr,
    getFormattedInvoiceNumber,
    getInvoiceAmountWithCurrency,
    getInvoiceEditURL,
} from '../../utils/invoice';
import { Link } from 'react-router-dom';
import { Stack } from '@mantine/core';
import { Payment } from '../../types/payment';
import { Filter, useFilters } from '../../hooks/filters';
import { Filters } from '../../components/Filters';

export function PaymentsReceived() {
    const payments = useAtomValue(getPaymentsAtom);

    const sortedPayments = Object.values(payments).sort((a, b) => {
        const dateA = new Date(a.paymentDate).getTime();
        const dateB = new Date(b.paymentDate).getTime();
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return 0;
    });

    const {
        filters,
        updateFilter,
        filteredObjs: filteredPayments,
    } = useFilters(
        sortedPayments,
        [
            { value: '', type: 'date' },
            { value: '', type: 'customer' },
        ],
        getPaymentsFilterCmpFunctions,
    );

    const customers = useAtomValue(getCustomersAtom);
    const invoices = useAtomValue(getInvoicesAtom);
    return (
        <Stack gap='md'>
            <Filters filters={filters} updateFilter={updateFilter} />
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
                    {
                        name: 'Amount in INR',
                        accessor: (row) => getAmountInInr(row),
                    },
                ]}
                data={filteredPayments}
            />
        </Stack>
    );
}

function getPaymentsFilterCmpFunctions(
    filters: Filter[],
): ((payment: Payment) => boolean)[] {
    const filterFns = [];
    for (const filter of filters) {
        if (filter.type === 'date') {
            if (filter.value === 'today') {
                filterFns.push((payment: Payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    const today = new Date();
                    return (
                        paymentDate.getDate() === today.getDate() &&
                        paymentDate.getMonth() === today.getMonth() &&
                        paymentDate.getFullYear() === today.getFullYear()
                    );
                });
            } else if (filter.value === 'this-week') {
                filterFns.push((payment: Payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    const today = new Date();
                    const day = today.getDay();
                    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
                    const weekStart = new Date(today.setDate(diff));
                    return paymentDate >= weekStart;
                });
            } else if (filter.value === 'last-week') {
                filterFns.push((payment: Payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    const today = new Date();
                    const day = today.getDay();
                    const diff = today.getDate() - day - 6;
                    const weekStart = new Date(today.setDate(diff));
                    const lastWeekStart = new Date(
                        weekStart.setDate(weekStart.getDate() - 7),
                    );
                    return (
                        paymentDate >= lastWeekStart && paymentDate < weekStart
                    );
                });
            } else if (filter.value === 'this-month') {
                filterFns.push((payment: Payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    const today = new Date();
                    return (
                        paymentDate.getMonth() === today.getMonth() &&
                        paymentDate.getFullYear() === today.getFullYear()
                    );
                });
            } else if (filter.value === 'last-month') {
                filterFns.push((payment: Payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    const today = new Date();
                    const lastMonth = new Date(
                        today.getFullYear(),
                        today.getMonth() - 1,
                        1,
                    );
                    const thisMonth = new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        1,
                    );
                    return paymentDate >= lastMonth && paymentDate < thisMonth;
                });
            } else if (filter.value === 'this-year') {
                filterFns.push((payment: Payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    // current fiscal year, starting from April 1st to March 31st
                    const today = new Date();
                    const fiscalYearStart = new Date(today.getFullYear(), 3, 1);
                    const fiscalYearEnd = new Date(
                        today.getFullYear() + 1,
                        2,
                        31,
                    );
                    return (
                        paymentDate >= fiscalYearStart &&
                        paymentDate <= fiscalYearEnd
                    );
                });
            } else if (filter.value === 'last-year') {
                filterFns.push((payment: Payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    // last fiscal year, starting from April 1st to March 31st
                    const today = new Date();
                    const fiscalYearStart = new Date(
                        today.getFullYear() - 1,
                        3,
                        1,
                    );
                    const fiscalYearEnd = new Date(today.getFullYear(), 2, 31);
                    return (
                        paymentDate >= fiscalYearStart &&
                        paymentDate <= fiscalYearEnd
                    );
                });
            } else {
                filterFns.push(() => true);
            }
        }
        if (filter.type === 'customer') {
            if (filter.value === '') {
                filterFns.push(() => true);
            } else {
                filterFns.push(
                    (payment: Payment) => payment.customerId === filter.value,
                );
            }
        }
    }
    return filterFns;
}
