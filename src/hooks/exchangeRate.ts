import { useAtomValue, useSetAtom } from 'jotai';
import {
    getExchangeRateAtom,
    updateExchangeRateAtom,
} from '../atoms/exchangeRate';
import { useEffect, useMemo } from 'react';

export const useExchangeRate = (targetCurrency: string) => {
    const exchangeRateAtom = useMemo(
        () => getExchangeRateAtom(targetCurrency),
        [targetCurrency],
    );
    const exchangeRate = useAtomValue(exchangeRateAtom);
    const updateExchangeRate = useSetAtom(updateExchangeRateAtom);

    useEffect(() => {
        if (targetCurrency.length === 0) return;
        const now = Date.now();
        const lastUpdated = exchangeRate?.lastUpdated || null;

        // if within the last hour, don't fetch
        if (lastUpdated && now - lastUpdated < 3600000) return;
        fetch(`https://open.er-api.com/v6/latest/${targetCurrency}`)
            .then((res) => res.json())
            .then((data) => {
                updateExchangeRate({
                    currency: targetCurrency,
                    rate: data.rates.INR,
                });
            });
    });

    return exchangeRate?.rate || 1;
};
