import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useAtomValue, useSetAtom } from 'jotai';
import {
    getInvoiceByIdAtom,
    markInvoiceAsSentAtom,
} from '../../atoms/invoices';
import { getCustomerByInvoiceIdAtom } from '../../atoms/customers';
import { InvoicePage } from '../InvoicePage';
import {
    ActionIcon,
    Button,
    ButtonProps,
    Flex,
    PolymorphicComponentProps,
} from '@mantine/core';
import {
    IconMailCheck,
    IconPencil,
    IconPrinter,
    IconX,
} from '@tabler/icons-react';
import { Invoice, InvoiceStatus } from '../../types/invoice';
import { useNavigate } from 'react-router-dom';
import { getFormattedInvoiceNumber } from '../../utils/invoice';
import { useMemo } from 'react';
import { getRouteByName } from '../../routes/utils';

type Props = {
    invoiceId: string | null;
    goBack: () => void;
};

export const InvoicePreviewWithActions = ({ invoiceId, goBack }: Props) => {
    const invoicesAtom = useMemo(
        () => getInvoiceByIdAtom(invoiceId || ''),
        [invoiceId],
    );
    const invoice = useAtomValue(invoicesAtom);
    const customersAtom = useMemo(
        () => getCustomerByInvoiceIdAtom(invoiceId || ''),
        [invoiceId],
    );
    const customer = useAtomValue(customersAtom);
    const document = <InvoicePage invoice={invoice} customer={customer} />;

    return (
        <Flex direction='column'>
            <Actions invoice={invoice} document={document} goBack={goBack} />
            <PDFViewer className='w-full h-[80vh]' showToolbar={false}>
                {document}
            </PDFViewer>
        </Flex>
    );
};

type ActionsProps = {
    invoice: Invoice;
    document: React.ReactElement;
    goBack: () => void;
};
const Actions = ({ invoice, document: pdfDocument, goBack }: ActionsProps) => {
    const StyledButton = ({
        children,
        ...props
    }: PolymorphicComponentProps<'button', ButtonProps>) => (
        <Button
            variant='default'
            className='!border-0 !bg-transparent !border-r-2 !border-gray-200 !rounded-none'
            {...props}
        >
            {children}
        </Button>
    );
    const navigate = useNavigate();

    function goToEditPage() {
        navigate(getRouteByName('edit_invoice', { id: invoice.id }).url);
    }

    const markAsSentInvoice = useSetAtom(markInvoiceAsSentAtom);
    function markAsSent() {
        markAsSentInvoice(invoice.id);
    }

    function recordPayment() {
        navigate(`/payments/add/${invoice.id}`);
    }

    return (
        <Flex
            justify='space-between'
            align='center'
            className='bg-gray-100 h-fit'
        >
            <Flex columnGap={10}>
                <StyledButton
                    leftSection={<IconPencil />}
                    onClick={goToEditPage}
                >
                    Edit
                </StyledButton>
                <PDFDownloadLink
                    document={pdfDocument}
                    fileName={`${getFormattedInvoiceNumber(invoice)}.pdf`}
                >
                    {() => (
                        <StyledButton leftSection={<IconPrinter />}>
                            PDF/Print
                        </StyledButton>
                    )}
                </PDFDownloadLink>
                {invoice.status === InvoiceStatus.Draft && (
                    <StyledButton
                        leftSection={<IconMailCheck />}
                        onClick={markAsSent}
                    >
                        Mark as sent
                    </StyledButton>
                )}
                {invoice.status === InvoiceStatus.Sent && (
                    <StyledButton
                        leftSection={<IconMailCheck />}
                        onClick={recordPayment}
                    >
                        Record payment
                    </StyledButton>
                )}
            </Flex>
            <ActionIcon
                mr={5}
                onClick={goBack}
                variant='default'
                className='!border-0 !bg-transparent !h-fit'
                aria-label='Close'
                size={20}
            >
                <IconX />
            </ActionIcon>
        </Flex>
    );
};
