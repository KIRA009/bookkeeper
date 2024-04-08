export const PaymentMode = [
    'Bank Remittance',
    'Bank Transfer',
    'Cash',
    'Cheque',
    'Credit Card',
] as const;

export type Payment = {
    id: string;
    customerId: string;
    invoiceId: string;
    amountReceived: number;
    bankCharges: number;
    paymentDate: string;
    paymentMode: (typeof PaymentMode)[number];
    exchangeRate: number;
    notes: string;
};
