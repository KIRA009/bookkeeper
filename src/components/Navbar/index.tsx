import { AppShell, Box, Stack } from '@mantine/core';
import { NavLink } from 'react-router-dom';

const routes = [
    { url: '/', component: 'Invoices' },
    { url: '/invoice/add/', component: 'Add Invoice' },
    { url: '/customer/add/', component: 'Add Customer' },
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
