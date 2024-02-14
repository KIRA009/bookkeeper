import { Flex, Text } from '@mantine/core';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteInvoiceAtom } from '../../atoms/invoices';
import { Customer } from '../../types/customer';
import { Invoice } from '../../types/invoice';
import {
    getInvoiceAmount,
    getInvoiceAmountInString,
} from '../../utils/invoiceAmount';
import { InvoicePage } from '../InvoicePage';
import { useSetAtom } from 'jotai';

interface Props {
    invoice: Invoice;
    customer: Customer;
}

export const InvoiceDetails = ({ invoice, customer }: Props) => {
    const [showDownloadLink, setShowDownloadLink] = useState(false);
    const sumWithSymbol = getInvoiceAmountInString(
        getInvoiceAmount(invoice),
        customer,
    );
    const deleteInvoice = useSetAtom(deleteInvoiceAtom);
    const _deleteInvoice = (
        e: MouseEvent<HTMLAnchorElement>,
        invoiceId: string,
    ) => {
        e.preventDefault();
        deleteInvoice(invoiceId);
    };
    return (
        <Flex justify='space-between' className='p-4 mb-4 bg-gray-300'>
            <Text component='span'>
                INV - {invoice.number} for {sumWithSymbol}
            </Text>
            <Text component='span'>
                <Link to={`/invoice/edit/${invoice.id}`}>
                    <Text>Edit invoice</Text>
                </Link>
                {showDownloadLink ? (
                    <PDFDownloadLink
                        document={
                            <InvoicePage
                                invoice={invoice}
                                customer={customer}
                            />
                        }
                        fileName={`INV - ${invoice.number}`}
                        aria-label='Save PDF'
                    >
                        Download
                    </PDFDownloadLink>
                ) : (
                    <Link to='#' onClick={() => setShowDownloadLink(true)}>
                        <Text>Show download link</Text>
                    </Link>
                )}
                <Link to='#' onClick={(e) => _deleteInvoice(e, invoice.id)}>
                    <Text>Delete invoice</Text>
                </Link>
            </Text>
        </Flex>
    );
};
