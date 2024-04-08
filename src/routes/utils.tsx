import { AddCustomer } from '../pages/AddCustomer';
import { AddInvoice } from '../pages/AddInvoice';
import { EditInvoice } from '../pages/EditInvoice';
import { Invoices } from '../pages/Invoices';
import { AddPayment } from '../pages/AddPayment';
import { Reports } from '../pages/Reports';
import { RouteInterface } from '../types/route';

export const routes = [
    {
        url: '/',
        name: 'list_invoices',
        component: <Invoices />,
    },
    {
        url: '/invoices/add/',
        name: 'add_invoice',
        component: <AddInvoice />,
    },
    {
        url: '/invoices/edit/:id',
        name: 'edit_invoice',
        component: <EditInvoice />,
    },
    {
        url: '/customers/add/',
        name: 'add_customer',
        component: <AddCustomer />,
    },
    {
        url: '/invoices',
        name: 'list_invoices',
        component: <Invoices />,
    },
    {
        url: '/payments/add/:id',
        name: 'add_payment',
        component: <AddPayment />,
    },
    {
        url: '/reports',
        name: 'list_reports',
        component: <Reports />,
    },
] as const;

type RouteName = (typeof routes)[number]['name'];

export function getRouteByName<T extends RouteName>(
    name: T,
    args: Record<string, string> = {},
): RouteInterface {
    const route = routes.find((route) => route.name === name)!;
    return {
        ...route,
        url: route.url.replace(/:(\w+)/g, (_, key) => args[key]),
    };
}
