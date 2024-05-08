import { useAtomValue } from 'jotai';
import { Filter } from '../../hooks/filters';
import { getCustomersAtom } from '../../atoms/customers';
import { Group, Select } from '@mantine/core';

type FilterProps = {
    filters: Filter[];
    updateFilter: (type: Filter['type'], value: string) => void;
};

export function Filters({ filters, updateFilter }: FilterProps) {
    const customers = useAtomValue(getCustomersAtom);
    function getFilterValue(filterType: Filter['type']) {
        const filter = filters.find((f) => f.type === filterType);
        return filter ? filter.value : 'all';
    }

    return (
        <Group gap='md'>
            <Select
                data={[
                    { value: '', label: 'All' },
                    { value: 'today', label: 'Today' },
                    { value: 'this-week', label: 'This Week' },
                    { value: 'last-week', label: 'Last Week' },
                    { value: 'this-month', label: 'This Month' },
                    { value: 'last-month', label: 'Last Month' },
                    { value: 'this-year', label: 'This Year' },
                    { value: 'last-year', label: 'Last Year' },
                ]}
                value={getFilterValue('date')}
                onChange={(value) =>
                    value !== null && updateFilter('date', value)
                }
                label='Filter by date'
                searchable
            />
            <Select
                data={[{ value: '', label: 'All' }].concat(
                    Object.values(customers).map((customer) => ({
                        value: customer.id,
                        label: customer.name,
                    })),
                )}
                value={getFilterValue('customer')}
                onChange={(value) =>
                    value !== null && updateFilter('customer', value)
                }
                label='Filter by customer'
                searchable
            />
        </Group>
    );
}
