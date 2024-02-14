import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import compose from './compose';
import { Invoice } from '../../types/invoice';
import converter from 'number-to-words';
import { Customer } from '../../types/customer';
import {
    getInvoiceAmount,
    getInvoiceAmountInString,
    getLongStringCurrency,
} from '../../utils/invoiceAmount';

interface Props {
    invoice: Invoice;
    customer: Customer;
}

export const InvoicePage = ({ invoice, customer }: Props) => {
    const sum = getInvoiceAmount(invoice);
    const wordSum = converter
        .toWords(sum)
        .split(' ')
        .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ');
    const sumWithSymbol = getInvoiceAmountInString(sum, customer);
    const currencyString = getLongStringCurrency(customer);
    return (
        <Document>
            <Page style={compose('invoice_wrapper')}>
                <View style={compose('flex')}>
                    <View style={compose('50')}>
                        <Text style={compose('bold fs-medium')}>
                            {import.meta.env.VITE_USER_NAME}
                        </Text>
                        <Text style={compose('fs-small')}>Assam</Text>
                        <Text style={compose('fs-small')}>India</Text>
                    </View>
                    <View style={compose('50')}>
                        <Text style={compose('fs-large right bold')}>
                            TAX INVOICE
                        </Text>
                        <Text style={compose('fs-small right bold')}>
                            # INV - {invoice.number}
                        </Text>
                    </View>
                </View>
                <View style={compose('flex align-center mt-large')}>
                    <View style={compose('50')}>
                        <Text style={compose('fs-small')}>Bill To:</Text>
                        <Text style={compose('fs-small bold mt-small')}>
                            {customer.name}
                        </Text>
                        <Text style={compose('fs-small')}>
                            {customer.address}
                        </Text>
                    </View>
                    <View style={compose('flex 35 right')}>
                        <Text style={compose('fs-small bold')}>
                            Invoice Date:{' '}
                        </Text>
                        <Text style={compose('fs-small bold')}>
                            {invoice.creationDate}
                        </Text>
                    </View>
                </View>
                <View style={compose('mt-large')}>
                    <Text style={compose('fs-small')}>Subject:</Text>
                    <Text style={compose('fs-small bold mt-small')}>
                        {invoice.subject}
                    </Text>
                </View>
                <View style={compose('mt-large')}>
                    <View style={compose('row flex bg-gray')}>
                        <Text style={compose('fs-small w-8 p-4-8 fl-small')}>
                            #
                        </Text>
                        <Text
                            style={compose('fs-small w-40 p-4-8 left fl-large')}
                        >
                            Item & Description
                        </Text>
                        <Text
                            style={compose('fs-small w-17 p-4-8 right fl-med')}
                        >
                            Hours
                        </Text>
                        <Text
                            style={compose('fs-small w-17 p-4-8 right fl-med')}
                        >
                            Rate
                        </Text>
                        <Text
                            style={compose('fs-small w-18 p-4-8 right fl-med')}
                        >
                            Amount
                        </Text>
                    </View>
                    {invoice.items.map((item, index) => (
                        <View style={compose('row flex')} key={index}>
                            <Text
                                style={compose('fs-small w-8 p-4-8 fl-small')}
                            >
                                {index + 1}
                            </Text>
                            <Text
                                style={compose(
                                    'fs-small w-40 p-4-8 left fl-large',
                                )}
                            >
                                {item.itemDetail}
                            </Text>
                            <Text
                                style={compose(
                                    'fs-small w-17 p-4-8 right fl-med',
                                )}
                            >
                                {item.quantity}
                            </Text>
                            <Text
                                style={compose(
                                    'fs-small w-17 p-4-8 right fl-med',
                                )}
                            >
                                {item.rate}
                            </Text>
                            <Text
                                style={compose(
                                    'fs-small w-18 p-4-8 right fl-med',
                                )}
                            >
                                {item.quantity * item.rate}
                            </Text>
                        </View>
                    ))}
                </View>
                <View style={compose('mt-small flex')}>
                    <Text style={compose('fs-small w-48 p-4-8')}></Text>
                    <Text style={compose('fs-small w-26 p-4-8 right')}>
                        Sub Total
                    </Text>
                    <Text style={compose('fs-small w-26 p-4-8 right')}>
                        {sumWithSymbol}
                    </Text>
                </View>
                <View style={compose('mt-small flex')}>
                    <Text style={compose('fs-small w-48 p-4-8')}></Text>
                    <Text
                        style={compose(
                            'fs-small w-26 p-4-8 right bold bg-light-gray',
                        )}
                    >
                        Total
                    </Text>
                    <Text
                        style={compose(
                            'fs-small w-26 p-4-8 right bold bg-light-gray',
                        )}
                    >
                        {sumWithSymbol}
                    </Text>
                </View>
                <View style={compose('mt-small flex')}>
                    <Text style={compose('fs-small w-48 p-4-8')}></Text>
                    <Text style={compose('fs-small w-26 p-4-8 right')}>
                        Total in Words:
                    </Text>
                    <Text style={compose('fs-small w-26 p-4-8 right bold')}>
                        {wordSum} {currencyString}
                    </Text>
                </View>
                <View style={compose('mt-large')}>
                    <Image
                        src={import.meta.env.VITE_SIG_URL}
                        style={compose('image w-35')}
                    />
                    <Text style={compose('mt-small fs-small')}>
                        {import.meta.env.VITE_USER_NAME}
                    </Text>
                    <Text style={compose('fs-small')}>
                        Authorized Signature
                    </Text>
                </View>
            </Page>
        </Document>
    );
};
