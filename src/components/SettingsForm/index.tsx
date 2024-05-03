import { useAtomValue, useSetAtom } from 'jotai';
import { editSettingsAtom, settingsAtom } from '../../atoms/settings';
import { isNotEmpty, useForm } from '@mantine/form';
import {
    Button,
    FileButton,
    Image,
    Stack,
    Text,
    TextInput,
    Textarea,
} from '@mantine/core';
import { Settings } from '../../types/settings';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';

export const SettingsForm = () => {
    const settings = useAtomValue(settingsAtom);
    const form = useForm<Settings>({
        initialValues: settings,
        validate: {
            name: isNotEmpty('Name is required'),
            address: isNotEmpty('Address is required'),
            gstin: isNotEmpty('GSTIN is required'),
            signature: isNotEmpty('Signature is required'),
        },
        validateInputOnBlur: true,
    });

    useEffect(() => {
        form.setValues(settings);
    }, [settings]);

    const editSettings = useSetAtom(editSettingsAtom);
    const save = (values: Settings) => {
        editSettings(values);
        notifications.show({
            title: 'Settings saved',
            message: 'Settings saved successfully',
            color: 'green',
        });
    };

    const onSignatureChange = (file: File | null) => {
        if (!file) {
            form.setFieldValue('signature', '');
            return;
        }
        // convert file to base64 string
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            form.setFieldValue('signature', reader.result as string);
        };
    };
    return (
        <form
            className='max-w-[800px] mx-auto mt-20'
            onSubmit={form.onSubmit(save)}
        >
            <Stack gap='md'>
                <Text fz={32} mb={20}>
                    Settings
                </Text>
                <TextInput
                    {...form.getInputProps('name')}
                    label='Name'
                    required
                    placeholder='Bookkeeper'
                />
                <Textarea
                    {...form.getInputProps('address')}
                    label='Address'
                    required
                    placeholder='123 Main St'
                />
                <TextInput
                    {...form.getInputProps('gstin')}
                    label='GSTIN'
                    required
                    placeholder='123456789'
                />
                <FileButton onChange={onSignatureChange}>
                    {(props) => (
                        <Button {...props} w='fit-content' variant='default'>
                            Upload signature
                        </Button>
                    )}
                </FileButton>
                {form.values.signature && (
                    <Image src={form.values.signature} alt='Signature' />
                )}
            </Stack>
            <Button mt={20} type='submit'>
                Save settings
            </Button>
        </form>
    );
};
