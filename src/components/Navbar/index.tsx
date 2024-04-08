import { AppShell, Box, Button, Flex, Stack, Text } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import { getRouteByName } from '../../routes/utils';

const routes = [
    { url: getRouteByName('list_invoices')?.url, component: 'Invoices' },
    { url: getRouteByName('add_invoice')?.url, component: 'Add Invoice' },
    { url: getRouteByName('add_customer')?.url, component: 'Add Customer' },
    { url: getRouteByName('list_reports')?.url, component: 'Reports' },
];

export const Navbar = () => {
    return (
        <Box w='100%'>
            <AppShell.Section>
                <Flex direction='column' justify='space-between' h='100vh'>
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
                    <Button
                        variant='default'
                        className='!border-0'
                        leftSection={<IconSettings size={30} />}
                        h={50}
                    >
                        <Text size='xl'>Settings</Text>
                    </Button>
                </Flex>
            </AppShell.Section>
        </Box>
    );
};
