import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AddCustomer } from '../pages/AddCustomer';
import { AddInvoice } from '../pages/AddInvoice';
import { EditInvoice } from '../pages/EditInvoice';
import { Invoices } from '../pages/Invoices';
import { RouteInterface } from '../types/route';
import { AppShell } from '@mantine/core';
import { Navbar } from '../components/Navbar';

const routes: RouteInterface[] = [
    {
        url: '/',
        component: <Invoices />,
    },
    {
        url: '/invoice/add/',
        component: <AddInvoice />,
    },
    {
        url: '/invoice/edit/:id',
        component: <EditInvoice />,
    },
    {
        url: '/customer/add/',
        component: <AddCustomer />,
    },
    {
        url: '/invoices',
        component: <Invoices />,
    },
];

export const Router = () => {
    return (
        <BrowserRouter>
            <AppShell
                p='md'
                navbar={{
                    width: 300,
                    breakpoint: 'sm',
                    collapsed: { mobile: false },
                }}
            >
                <AppShell.Navbar>
                    <Navbar />
                </AppShell.Navbar>
                <AppShell.Main>
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                path={route.url}
                                key={route.url}
                                element={route.component}
                            />
                        ))}
                    </Routes>
                </AppShell.Main>
            </AppShell>
        </BrowserRouter>
    );
};
