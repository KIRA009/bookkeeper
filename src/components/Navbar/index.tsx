import { AppShell, Box, Stack } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { getRouteByName } from '../../routes/utils';

const routes = [
    { url: getRouteByName('list_invoices')?.url, component: 'Invoices' },
    { url: getRouteByName('add_invoice')?.url, component: 'Add Invoice' },
    { url: getRouteByName('add_customer')?.url, component: 'Add Customer' },
    { url: getRouteByName('list_reports')?.url, component: 'Reports' },
    { url: getRouteByName('settings')?.url, component: 'Settings' },
];

export const Navbar = () => {
    return (
        <Box w='100%'>
            <AppShell.Section>
                <Stack gap={0}>
                    {routes.map((route) => (
                        <NavLink
                            to={route.url}
                            key={route.url}
                            className={({ isActive }) =>
                                (isActive ? 'bg-gray-200' : '') + ` p-4`
                            }
                        >
                            {route.component}
                        </NavLink>
                    ))}
                </Stack>
            </AppShell.Section>
        </Box>
    );
};
