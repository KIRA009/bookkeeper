import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

type initialState = Record<
    string,
    {
        rate: number;
        lastUpdated: number;
    }
>;

export const exchangeRatesAtom = atomWithStorage<initialState>(
    'bookkeeper:exchangeRates',
    {},
);

export const updateExchangeRateAtom = atom(
    null,
    (get, set, payload: { currency: string; rate: number }) => {
        set(exchangeRatesAtom, {
            ...get(exchangeRatesAtom),
            [payload.currency]: {
                rate: Math.round(payload.rate * 10000) / 10000,
                lastUpdated: Date.now(),
            },
        });
    },
);

export const getExchangeRateAtom = (currency: string) =>
    atom((get) => {
        const exchangeRates = get(exchangeRatesAtom);
        return exchangeRates[currency];
    });
