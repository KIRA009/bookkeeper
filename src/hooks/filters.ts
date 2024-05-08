import { useState, useMemo } from 'react';

export type Filter = {
    type: string;
    value: string;
};

export function useFilters<U>(
    objs: U[],
    initialFilters: Filter[] = [],
    filterCmpFns: (filters: Filter[]) => ((obj: U) => boolean)[],
) {
    const [filters, setFilters] = useState<Filter[]>(initialFilters);
    function updateFilter(filterType: Filter['type'], value: string) {
        setFilters((filters) =>
            filters.map((filter) =>
                filter.type === filterType ? { ...filter, value } : filter,
            ),
        );
    }
    const filterFns = useMemo(
        () => filterCmpFns(filters),
        [filters.map((filter) => filter.value).join(',')],
    );
    const filteredObjs = objs.filter((obj) => filterFns.every((fn) => fn(obj)));

    return {
        filters,
        updateFilter,
        filteredObjs,
    };
}
