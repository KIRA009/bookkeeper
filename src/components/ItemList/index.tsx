import { InvoiceItem } from '../../types/invoice-item';
import { Table, TextInput, Text, ActionIcon, NumberInput } from '@mantine/core';
import { IconCirclePlus, IconTrash } from '@tabler/icons-react';
import {
    UseFormReturnType,
    isInRange,
    isNotEmpty,
    useForm,
} from '@mantine/form';
import { Invoice } from '../../types/invoice';

interface Props {
    form: UseFormReturnType<Omit<Invoice, 'id'>>;
}

export const ItemList = ({ form }: Props) => {
    const items = form.values.items;

    const itemForm = useForm<Omit<InvoiceItem, 'amount'>>({
        initialValues: {
            itemDetail: '',
            quantity: 0,
            rate: 0,
        },
        validateInputOnBlur: true,
        validate: {
            itemDetail: isNotEmpty('Item detail is required'),
            quantity: isInRange({ min: 1 }, 'Quantity must be greater than 0'),
            rate: isInRange({ min: 1 }, 'Rate must be greater than 0'),
        },
    });

    const addItem = () => {
        itemForm.validate();
        if (!itemForm.isValid()) {
            return;
        }
        const values = itemForm.values;
        const itemDetails: InvoiceItem = {
            ...values,
        };
        form.insertListItem('items', itemDetails);
        itemForm.reset();
    };
    const removeItem = (index: number) => {
        form.removeListItem('items', index);
    };
    const total = items.reduce(
        (acc, item) => acc + item.quantity * item.rate,
        0,
    );
    return (
        <div>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Item description</Table.Th>
                        <Table.Th>Quantity</Table.Th>
                        <Table.Th>Rate</Table.Th>
                        <Table.Th>Amount</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td className='text-right align-top'>
                            <TextInput
                                {...itemForm.getInputProps('itemDetail')}
                            />
                        </Table.Td>
                        <Table.Td className='align-top'>
                            <NumberInput
                                {...itemForm.getInputProps('quantity')}
                                min={1}
                            />
                        </Table.Td>
                        <Table.Td className='align-top'>
                            <NumberInput
                                {...itemForm.getInputProps('rate')}
                                min={1}
                            />
                        </Table.Td>
                        <Table.Td className='align-top'>
                            <TextInput
                                readOnly
                                value={
                                    itemForm.values.quantity *
                                    itemForm.values.rate
                                }
                            />
                        </Table.Td>
                        <Table.Td className='text-center align-top'>
                            <ActionIcon
                                color='blue'
                                variant='filled'
                                onClick={addItem}
                            >
                                <IconCirclePlus />
                            </ActionIcon>
                        </Table.Td>
                    </Table.Tr>
                    {items.map((item, index) => (
                        <Table.Tr key={index}>
                            <Table.Td className='text-right align-top'>
                                <TextInput
                                    {...form.getInputProps(
                                        `items.${index}.itemDetail`,
                                    )}
                                />
                            </Table.Td>
                            <Table.Td className='align-top'>
                                <NumberInput
                                    {...form.getInputProps(
                                        `items.${index}.quantity`,
                                    )}
                                    min={1}
                                />
                            </Table.Td>
                            <Table.Td className='align-top'>
                                <NumberInput
                                    {...form.getInputProps(
                                        `items.${index}.rate`,
                                    )}
                                    min={1}
                                />
                            </Table.Td>
                            <Table.Td className='align-top'>
                                <TextInput
                                    readOnly
                                    value={item.quantity * item.rate}
                                />
                            </Table.Td>
                            <Table.Td className='text-center'>
                                {index > 1 && (
                                    <ActionIcon
                                        color='red'
                                        variant='filled'
                                        onClick={() => removeItem(index)}
                                    >
                                        <IconTrash />
                                    </ActionIcon>
                                )}
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
            <Text className='text-right' my={10}>
                Subtotal: {total}
            </Text>
            <Text className='text-right' my={10}>
                Total: {total}
            </Text>
        </div>
    );
};
