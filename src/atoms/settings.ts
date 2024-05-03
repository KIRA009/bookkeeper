import { atom } from 'jotai';
import { Settings } from '../types/settings';
import { atomWithStorage } from 'jotai/utils';

export const settingsAtom = atomWithStorage<Settings>('bookkeeper:settings', {
    name: 'Bookkeeper',
    address: '123 Main St',
    gstin: '123456789',
    signature: '',
});

export const getSettingsAtom = atom((get) => get(settingsAtom));

export const editSettingsAtom = atom(
    null,
    (get, set, payload: Partial<Settings>) => {
        set(settingsAtom, {
            ...get(settingsAtom),
            ...payload,
        });
    },
);
