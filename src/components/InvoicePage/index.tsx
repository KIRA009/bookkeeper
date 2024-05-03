import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { Invoice } from '../../types/invoice';
import converter from 'number-to-words';
import { Customer } from '../../types/customer';
import {
    getFormattedInvoiceAmount,
    getFormattedInvoiceNumber,
    getInvoiceAmount,
    getLongStringCurrency,
} from '../../utils/invoice';
import { Font } from '@react-pdf/renderer';
import { dateToString } from '../../utils/date';
import { useAtomValue } from 'jotai';
import { settingsAtom } from '../../atoms/settings';

Font.register({
    family: 'Nunito',
    fonts: [
        {
            src: 'https://fonts.gstatic.com/s/nunito/v12/XRXV3I6Li01BKofINeaE.ttf',
        },
        {
            src: 'https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofA6sKUYevN.ttf',
            fontWeight: 600,
        },
    ],
});
Font.registerHyphenationCallback((word) => [word]);

interface Props {
    invoice: Invoice;
    customer: Customer;
}

const WrapText = ({ text }: { text?: string }) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {text?.match(/\w+|\W+/g)?.map((seg, i) => <Text key={i}>{seg}</Text>)}
    </View>
);

export const InvoicePage = ({ invoice, customer }: Props) => {
    const settings = useAtomValue(settingsAtom);
    const sum = getInvoiceAmount(invoice);
    const wordSum = converter
        .toWords(sum)
        .split(' ')
        .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ');
    const currencyString = getLongStringCurrency(customer);
    return (
        <Document title={invoice.number}>
            <Page
                size='A4'
                style={{ padding: 40, fontFamily: 'Nunito', fontSize: 10 }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <View>
                        <Text style={{ fontWeight: 600 }}>{settings.name}</Text>
                        {settings.address.split('\n').map((line, index) => (
                            <Text key={index}>{line}</Text>
                        ))}
                        <Text>GSTIN: {settings.gstin}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, fontWeight: 600 }}>
                            TAX INVOICE
                        </Text>
                        <Text style={{ fontWeight: 600 }}>
                            # {getFormattedInvoiceNumber(invoice)}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        marginTop: 50,
                    }}
                >
                    <View style={{ display: 'flex', rowGap: 5 }}>
                        <Text>Bill To</Text>
                        <Text>{customer.name}</Text>
                        {customer.address &&
                            customer.address
                                .split('\n')
                                .map((line, index) => (
                                    <Text key={index}>{line}</Text>
                                ))}
                    </View>
                    <View style={{ alignItems: 'flex-end', rowGap: 5 }}>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: 150,
                            }}
                        >
                            <Text>Invoice Date:</Text>
                            <Text>{dateToString(invoice.creationDate)}</Text>
                        </View>
                        {invoice.dueDate && (
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: 150,
                                }}
                            >
                                <Text>Due Date:</Text>
                                <Text>{dateToString(invoice.dueDate)}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={{ display: 'flex', rowGap: 5, marginTop: 20 }}>
                    <Text>Subject:</Text>
                    <Text>{invoice.subject}</Text>
                </View>
                <View
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        marginTop: 20,
                        padding: 5,
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Text style={{ flex: 1 }}>#</Text>
                    <Text style={{ flex: 6 }}>Item & Description</Text>
                    <Text style={{ flex: 2, textAlign: 'right' }}>Qty</Text>
                    <Text style={{ flex: 2, textAlign: 'right' }}>Rate</Text>
                    <Text style={{ flex: 2, textAlign: 'right' }}>IGST</Text>
                    <Text style={{ flex: 2, textAlign: 'right' }}>Amount</Text>
                </View>
                <View style={{ display: 'flex' }}>
                    {invoice.items.map((item, index) => (
                        <View
                            key={index}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
                                paddingVertical: 10,
                                paddingHorizontal: 5,
                            }}
                        >
                            <Text style={{ flex: 1 }}>{index + 1}</Text>
                            <Text style={{ flex: 6 }}>{item.itemDetail}</Text>
                            <Text style={{ flex: 2, textAlign: 'right' }}>
                                {item.quantity.toFixed(2)}
                            </Text>
                            <Text style={{ flex: 2, textAlign: 'right' }}>
                                {item.rate.toFixed(2)}
                            </Text>
                            <View
                                style={{
                                    display: 'flex',
                                    flex: 2,
                                    textAlign: 'right',
                                }}
                            >
                                <Text>0.00</Text>
                                <Text>0%</Text>
                            </View>
                            <Text style={{ flex: 2, textAlign: 'right' }}>
                                {(item.quantity * item.rate).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                </View>
                <View
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        marginTop: 20,
                        rowGap: 20,
                    }}
                >
                    <View
                        style={{
                            width: 150,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}
                    >
                        <Text>Sub Total</Text>
                        <Text>{getFormattedInvoiceAmount(sum)}</Text>
                    </View>
                    <View
                        style={{
                            width: 150,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}
                    >
                        <Text>IGST0 (0%)</Text>
                        <Text>{getFormattedInvoiceAmount(0)}</Text>
                    </View>
                    <View
                        style={{
                            width: 150,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}
                    >
                        <Text>Total</Text>
                        <Text>{getFormattedInvoiceAmount(sum)}</Text>
                    </View>
                    <View
                        style={{
                            width: 250,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}
                    >
                        <Text style={{ width: 100 }}>Total in words</Text>
                        <WrapText text={`${wordSum} ${currencyString}`} />
                    </View>
                </View>
                <View style={{ marginTop: 50, rowGap: 5 }}>
                    <Image
                        src={settings.signature}
                        style={{ width: 150, height: 50 }}
                    />
                    <Text>Authorized Signature</Text>
                </View>
            </Page>
        </Document>
    );
};
